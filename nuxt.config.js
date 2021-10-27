export default {
  /*
   ** Headers of the page
   ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
   */
  head: {
    title: "Monster Hunters - Hoadley Hide 2022",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Hoadley Hide 2022: Monster Hunters"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  srcDir: "src/",
  target: "static",
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  /*
   ** Nuxt.js modules
   ** Doc: https://modules.nuxtjs.org
   */
  modules: [],
  buildModules: ["@nuxtjs/vuetify", "@nuxtjs/pwa"],
  /*
   ** Global CSS
   ** Doc: https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-css
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   ** Doc: https://nuxtjs.org/docs/2.x/directory-structure/plugins
   */
  plugins: [],

  vuetify: {
    customVariables: ["~/scss/variables.scss"],
    treeShake: true,
    theme: {
      dark: true
    }
  },

  /**
   * https://pwa.nuxtjs.org
   */
  pwa: {
    /**
     * https://pwa.nuxtjs.org/modules/manifest.html
     */
    manifest: {
      name: "Hoadley Hide 2022: Monster Hunters",
      description: "Hoadley Hide 2022: Monster Hunters",
      theme_color: "#000000",
      background_color: "#000000"
    },

    /**
     * https://pwa.nuxtjs.org/modules/meta.html#options
     */
    meta: {
      name: false,
      description: false,
      author: false,
      ogType: false,
      nativeUI: true
    }
  }
};
