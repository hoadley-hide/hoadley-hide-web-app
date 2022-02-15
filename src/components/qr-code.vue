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
          :logoSrc="`/hh-qr-code-logo-192x192.png`"
          :logoScale="0.3"
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
