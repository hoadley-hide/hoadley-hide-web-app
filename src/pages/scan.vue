<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>Scan QR code</v-card-title>

        <client-only v-if="!qrCodeError" placeholder="Loading...">
          <qrcode-stream
            @decode="onDecode"
            @init="onInit"
            :track="paintOutline"
          >
          </qrcode-stream>
        </client-only>

        <v-card-text v-else>
          <p class="error--text">{{ qrCodeError }}</p>
          <v-btn link @click.stop="resetQrCodeError" color="error">
            Retry Camera
          </v-btn>
          <v-text-field
            v-model="manualCode"
            label="Code"
            prefix="HH22:"
            :append-outer-icon="manualCode ? `mdi-check` : ``"
            @click:append-outer="validateManualInput"
            clearable
          ></v-text-field>
        </v-card-text>

        <v-card-text>
          {{ decodedString }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  data() {
    return {
      decodedString: "",
      manualCode: "",
      qrCodeError: null,
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Scan" },
    ]);
  },
  methods: {
    resetQrCodeError() {
      this.qrCodeError = null;
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

        this.qrCodeError =
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
    onDecode(decodedString) {
      this.decodedString = decodedString;

      const baseUrl = "https://hoadley-hide.netlify.app";
      if (this.decodedString.startsWith(baseUrl)) {
        const routePath = this.decodedString.replace(baseUrl, "");
        this.$router.push({ path: routePath });
      }
    },
    validateManualInput() {
      alert(this.manualCode);
    },
  },
};
</script>

<style scoped>
.qrcode-stream-wrapper {
  height: 50vh;
}
</style>