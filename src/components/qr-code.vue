<template>
  <div class="qr-code-container">
    <lazy>
      <client-only>
        <vue-qr
          :correctLevel="3"
          :text="qrCodeData"
          :size="500"
          :margin="20"
          :logoSrc="`/hh-qr-code-logo-192x192.png`"
          :logoScale="0.3"
          :logoCornerRadius="0"
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

        <div v-if="codeEntity" ref="printarea" class="printarea d-none">
          <h1>Hoadley Hide 2022</h1>
          <h2>Monster Hunters</h2>
          <div><img :src="cachedQrCodeDataString" alt="QR Code" /></div>
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

interface CodeEntity {
  code: string;
  path: string;
  name: string;
}

// https://github.com/Binaryify/vue-qr
export default {
  props: [
    "url", // For legacy usages
    "entity",
  ],
  data() {
    return {
      d: null as Printd | null,
      cachedQrCodeDataString: "",
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
  mounted() {
    if (this.$Printd) {
      this.d = new this.$Printd();
    }
  },
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
      const codeEl = this.$refs["qr-code"]?.$el;
      this.cachedQrCodeDataString = codeEl?.src;
      const printerEl = this.$refs["printarea"];

      if (!this.d || !codeEl || !printerEl) {
        return;
      }
      setTimeout(() => {
        this.d?.print(printerEl, [this.cssText]);
        this.printerLoading = false;
      }, 1000);
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
