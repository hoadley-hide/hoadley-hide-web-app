<template>
  <div class="qr-code-container">
    <lazy>
      <client-only>
        <vue-qr
          :qid="codeEntity.code"
          :correctLevel="3"
          :text="qrCodeData"
          :size="500"
          :margin="20"
          :logoSrc="`/HH-2022-Logo-Rip-T.png`"
          :logoScale="qrSize"
          :logoCornerRadius="0"
          :callback="renderComplete"
          class="qr-code-image"
          ref="qr-code"
        ></vue-qr>

        <v-btn
          v-if="codeEntity"
          block
          text
          color="warning"
          @click="printQrCode()"
          :loading="printerLoading"
        >
          <v-icon left>mdi-printer</v-icon>
          Print QR Code
        </v-btn>

        <div v-if="codeEntity" ref="printarea" class="d-none">
          <h1>Hoadley Hide 2022</h1>
          <h2>Monster Hunters</h2>
          <div><img :src="imageDataUri" alt="QR Code" /></div>
          <pre>{{ codeEntity.code }}</pre>
          <h3>{{ codeEntity.name }}</h3>
          <p>
            Scan this QR Code or go to <br />
            <code>{{ $config.baseUrl }}/scan</code> <br />
            to continue the adventure
          </p>
        </div>
      </client-only>
    </lazy>
  </div>
</template>

<script lang="ts">
import type { Printd } from "printd";
import { CodeEntity } from "~/types";

// https://github.com/Binaryify/vue-qr
export default {
  props: [
    "url", // For legacy usages
    "entity",
  ],
  data() {
    return {
      d: null as Printd | null,
      imageDataUri: "",
      printerLoading: false,
      cssText: `
        * {
          padding: 0;
          margin: 0;
        }
        body {
          font-size: 3rem;
          width: 100%;
          text-align:center;
          padding-top:4rem;
        }
        @font-face {
          font-family: "Geizer";
          font-style: normal;
          font-weight: 400;
          src: local("Geizer"), url(/_nuxt/src/fonts/Geizer.woff) format("woff"), url("https://fonts.cdnfonts.com/s/16304/Geizer.woff") format("woff");
        }
        h1, h2 {
          font-family: "Geizer", Arial, Helvetica, sans-serif;
        }
        not(h1),not(h2) {
          font-family:  Arial, Helvetica, sans-serif
        }
        img {
          width:70vw;
          height:70vw;
        }
        h3 {
          font-size:2.5rem;
        }
        p {
          padding-top:1rem;
          font-size: 1.5rem;
        }
      `,
    };
  },
  mounted() {},
  computed: {
    qrSize() {
      const len = this.qrCodeData.length;
      if (false) {
      } else if (0 <= len && len <= 38) {
        return 0.275;
      } else if (39 <= len && len <= 57) {
        return 0.3;
      } else if (58 <= len && len <= 71) {
        return 0.32;
      } else if (72 <= len && len <= 83) {
        return 0.291;
      } else if (84 <= len && len <= 105) {
        return 0.308;
      } else if (106 <= len && len <= 125) {
        return 0.323;
      } else if (126 <= len && len <= 127) {
        return 0.36;
      } else if (128 <= len && len <= 148) {
        return 0.334;
      } else if (149 <= len && len <= 174) {
        return 0.312;
      } else if (175 <= len && len <= 200) {
        return 0.294;
      } else {
        return 0.3;
      }
    },
    qrCodeData() {
      if (this.url) {
        return this.url;
      } else if (this.codeEntity) {
        return `${this.$config.baseUrl}${this.codeEntity.path}?code=${this.codeEntity.code}`;
      }

      return null;
    },
    codeEntity(): CodeEntity | null {
      return (this.entity as unknown as CodeEntity) || null;
    },
  },
  methods: {
    printQrCode() {
      this.printerLoading = true;

      const printerEl = this.$refs["printarea"];

      if (!this.$Printd || !printerEl) {
        return;
      }

      const printer = new this.$Printd();
      setTimeout(() => {
        printer?.print(printerEl, [this.cssText]);
        this.printerLoading = false;
      }, 1000);
    },
    renderComplete(dataUri, qid) {
      this.imageDataUri = dataUri;
      this.$emit("image-data", {
        dataUri: dataUri,
        entityCode: qid,
      });
    },
  },
};
</script>

<style lang="css" scoped>
.qr-code-image {
  width: 50vh;
  height: 50vh;
  max-width: 300px;
  max-height: 300px;
  border-radius: 4px;
}
</style>
