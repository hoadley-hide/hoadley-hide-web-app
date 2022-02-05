<template>
  <v-card class="qr-code-container">
    <slot></slot>

    <lazy>
      <client-only placeholder="Loading...">
        <span v-if="showPermissionWarning">
          <v-alert type="warning" tile>
            <v-row align="center" class="w-full">
              <v-col cols="12" lg="8">
                We are about to ask you for permission to use your camera.
                <br />
                <br />
                If you do not grant permission the first time, you'll have to
                grant access manually in the future.
                <br />
                <br />
                We recommend ticking "Remember this desicion" so we don't have
                to ask in future.
              </v-col>
              <v-col>
                <v-btn @click="permissionWarningHasBeenRead()">
                  I Understand
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </span>

        <span v-if="showScanner">
          <v-card-text v-if="readerError">
            <p class="error--text">{{ readerError }}</p>
            <v-btn link @click.stop="resetReaderError" color="error">
              Reopen Camera
            </v-btn>
          </v-card-text>

          <span v-else>
            <v-btn
              text
              block
              class="w-full"
              @click.stop="closeScanner"
              color="info"
            >
              Use manual input
            </v-btn>
            <qrcode-stream
              @decode="onDecode"
              @init="onInit"
              :track="paintOutline"
            >
            </qrcode-stream>

            <v-card-text v-if="readerResult">{{ readerResult }}</v-card-text>
            <v-card-text v-else>Looking for QR Code...</v-card-text>
          </span>
        </span>

        <v-card-text v-if="showManualEntry">
          <v-btn
            v-if="scannerClosed"
            text
            block
            class="w-full"
            @click.stop="openScanner"
            color="info"
          >
            Open scanner
          </v-btn>
          <v-text-field
            v-model="codeManual"
            label="Code"
            prefix="HH22:"
            :append-outer-icon="codeManual ? `mdi-check` : ``"
            @click:append-outer="validateManualInput"
            clearable
          ></v-text-field>
        </v-card-text>
      </client-only>
    </lazy>
  </v-card>
</template>

<script lang="ts">
import { Entity } from "~/types";
// https://gruhn.github.io/vue-qrcode-reader/

export default {
  props: {
    manualPromptFirst: { default: false, type: Boolean },
  },
  data() {
    return {
      codeManual: "",
      scannerClosed: false,
      readerResult: "",
      readerError: null,
    };
  },
  mounted() {},
  computed: {
    showScanner() {
      return (
        !this.scannerClosed &&
        !this.manualPromptFirst &&
        !this.showPermissionWarning
      );
    },
    showManualEntry() {
      return this.scannerClosed || !!this.readerError || this.manualPromptFirst;
    },
    showPermissionWarning() {
      return !this.$store.state.hasPermissionWarningBeenRead;
    },
  },
  methods: {
    permissionWarningHasBeenRead() {
      this.$store.commit("permissionWarningHasBeenRead");
    },
    resetReaderError() {
      this.readerError = null;
    },
    openScanner() {
      this.scannerClosed = false;
    },
    closeScanner() {
      this.scannerClosed = true;
    },
    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        const errorCodeMap = {
          NotAllowedError: "ERROR: you need to grant camera access permission",
          NotFoundError: "ERROR: no camera on this device",
          NotSupportedError:
            "ERROR: secure context required (HTTPS, localhost)",
          NotReadableError: "ERROR: is the camera already in use?",
          OverconstrainedError: "ERROR: installed cameras are not suitable",
          StreamApiNotSupportedError:
            "ERROR: Stream API is not supported in this browser",
          InsecureContextError:
            "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.",
        };

        this.readerError =
          errorCodeMap[error.name] || `ERROR: Camera error (${error.name})`;
      }
    },
    paintOutline(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (const { x, y } of otherPoints) {
          ctx.lineTo(x, y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        ctx.stroke();
      }
    },
    async onDecode(readerResult) {
      this.readerResult = readerResult;

      try {
        const url = new URL(readerResult);
        const code = url.searchParams.get("code") || "";

        await this.validateCode(code);
      } catch (e) {
        if (
          typeof e === "string" &&
          /TypeError: URL constructor: .+ is not a valid URL/.test(e)
        ) {
          // Not a valid URL. Skip.
          return;
        }
        throw e;
      }
    },
    async validateManualInput() {
      await this.validateCode(this.codeManual);
    },
    async validateCode(code: string) {
      const entity: Entity = await this.$store.dispatch("validateCode", code);

      if (entity) {
        this.$store.dispatch("recordCodeScan", entity);
        this.$emit("valid-code", entity);
      }
    },
  },
};
</script>

<style scoped>
.qrcode-stream-wrapper {
  height: 50vh;
}
</style>
