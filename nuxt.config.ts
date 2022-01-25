import { defineNuxtConfig } from "@nuxt/bridge";
import fs from "fs";
import webpack from "webpack";

const packageJson = fs.readFileSync("./package.json").toString();
const version = JSON.parse(packageJson).version || "Unknown";

export default defineNuxtConfig({
  srcDir: "src/",
  target: "server",
  /*
   ** Headers of the page
   ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
   */
  head: {
    title: "Monster Hunters - Hoadley Hide 2022",
    meta: [],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "preload", as: "image", href: "/hh-qr-code-logo-192x192.png" },
    ],
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  /*
   ** Nuxt.js modules
   ** Doc: https://modules.nuxtjs.org
   */
  modules: [],
  buildModules: [
    "@nuxtjs/vuetify",
    "@nuxtjs/pwa",
    "vue-browser-detect-plugin/nuxt",
  ],
  /*
   ** Global CSS
   ** Doc: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-css
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   ** Doc: https://nuxtjs.org/docs/2.x/directory-structure/plugins
   */
  plugins: [
    { src: "~/plugins/filters.ts" },
    { src: "~/plugins/persistedState.client.js", mode: "client" },
    { src: "~/plugins/printd.client.ts", mode: "client" },
    { src: "~/plugins/pwa-update.js", mode: "client" },
    { src: "~/plugins/vue-qr.ts", mode: "client" },
    { src: "~/plugins/vue-qrcode-reader.ts", mode: "client" },
  ],

  vuetify: {
    customVariables: ["~/scss/variables.scss"],
    treeShake: true,
    theme: {
      dark: true,
    },
  },

  /**
   * https://pwa.nuxtjs.org
   */
  pwa: {
    icon: {
      fileName: "hhemblem-colour-hires-youtube.png",
    },
    /**
     * https://pwa.nuxtjs.org/modules/manifest.html
     */
    manifest: {
      name: "Hoadley Hide 2022: Monster Hunters",
      short_name: "Hoadley Hide",
      description: "Hoadley Hide 2022: Monster Hunters",
      theme_color: "#000000",
      background_color: "#000000",
      start_url: "https://hoadley-hide.netlify.app",
    },

    /**
     * https://pwa.nuxtjs.org/modules/meta.html#options
     */
    meta: {
      name: "Hoadley Hide 2022: Monster Hunters",
      description: "Hoadley Hide 2022: Monster Hunters",
      author: false,
      ogHost: "https://hoadley-hide.netlify.app",
      nativeUI: true,
    },

    /**
     * https://pwa.nuxtjs.org/modules/workbox.html#options
     */
    workbox: {
      enabled: true,
    },
  },
  privateRuntimeConfig: {
    cmsUrl: process.env.CMS_URL,
    cmsApiKey: process.env.CMS_KEY,
  },
  publicRuntimeConfig: {
    version: version,
    baseUrl: "https://hoadley-hide.netlify.app",
  },
});

export interface RuntimeConfig {
  public: {
    _app: {
      basePath: string;
      assetsPath: string;
      cdnURL: string;
    };
    version: string;
    baseUrl: string;
  };
  private: {
    cmsUrl: string;
    cmsApiKey: string;
  };
}
