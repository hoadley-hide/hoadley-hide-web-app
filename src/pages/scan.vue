<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Scan QR code</v-card-title>

        <v-card-text v-if="codeQueryParam !== null"
          >Valid query param detected, processing...</v-card-text
        >

        <client-only v-else-if="!readerError" placeholder="Loading...">
          <qrcode-stream
            @decode="onDecode"
            @init="onInit"
            :track="paintOutline"
          >
          </qrcode-stream>

          <v-card-text v-if="readerResult">{{ readerResult }}</v-card-text>
          <v-card-text v-else>Looking for QR Code...</v-card-text>
        </client-only>

        <v-card-text v-else>
          <p class="error--text">{{ readerError }}</p>
          <v-btn link @click.stop="resetReaderError" color="error">
            Retry Camera
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
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
// https://gruhn.github.io/vue-qrcode-reader/
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  data() {
    return {
      codeQueryParam: "" as string | null,
      codeManual: "",
      readerResult: "",
      readerError: null,
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Scan" },
    ]);

    this.parseQueryParam();
  },
  methods: {
    async parseQueryParam() {
      const validCode = await this.$store.dispatch("validateCode", {
        code: this.$route.query.code,
      });

      if (!validCode) {
        this.codeQueryParam = null;
        return;
      }

      this.$router.push(validCode);
    },
    resetReaderError() {
      this.readerError = null;
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
        const code = url.searchParams.get("code");

        const validCode = await this.$store.dispatch("validateCode", {
          code: code,
        });
        if (validCode) {
          this.$router.push(validCode);
        }
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
      const validCode = await this.$store.dispatch("validateCode", {
        code: this.codeManual,
      });
      if (validCode) {
        this.$router.push(validCode);
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
