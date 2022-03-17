<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Hoadley Hide 2022</v-list-item-title>
          <v-list-item-subtitle>v{{ buildNumber }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <client-only>
        <div v-if="$useUser()">
          <v-list-item :to="$useUser((u) => u.path, '')">
            <v-list-item-icon>
              <v-icon>mdi-account-details</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                Profile
                <small class="text--secondary">
                  ({{ $useUser((u) => u._type, "") | capitalize }})
                </small>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>
        </div>
      </client-only>
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          nuxt
          :href="item.href"
          :target="item.href ? '_blank' : ''"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="app-title">
        <nuxt-link to="/">Monster Hunters</nuxt-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn to="/emergency" icon nuxt v-show="$auth(['app:seeEmergencyInfo'])">
        <v-icon>mdi-phone</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <app-status-bar></app-status-bar>

      <setup-user v-show="clientLoaded && userSetupRequired"></setup-user>

      <v-container
        v-show="!clientLoaded"
        class="text-center"
        style="height: 70%"
      >
        <v-row style="height: 100%">
          <v-col
            align-self="center"
            class="d-flex flex-column justify-center align-center"
          >
            <v-img
              src="/HH-2022-Logo-Rip-T.png"
              style="position: absolute; width: 50px"
            ></v-img>
            <v-progress-circular indeterminate color="red" size="100">
            </v-progress-circular>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-show="clientLoaded && !userSetupRequired">
        <client-only>
          <Nuxt />
        </client-only>
      </v-container>
    </v-main>

    <alerts></alerts>

    <v-footer app padless absolute>
      <v-row no-gutters>
        <v-col md="6" class="d-none d-md-flex">
          <v-card
            flat
            tile
            width="100%"
            height="100%"
            class="text-center text-sm-left"
          >
            <v-card-text class="white--text">{{ monsterAcronym }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            flat
            tile
            width="100%"
            height="100%"
            class="text-center text-md-right"
          >
            <v-card-text class="white--text">
              {{ new Date().getFullYear() }} —
              <strong>Hoadley Hide Management Team</strong>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: "Home", icon: "mdi-home", to: "/" },
        { title: "Wiki", icon: "mdi-forum", to: "/wiki" },
        { title: "The Adventure", icon: "mdi-shield-sword", to: "/event" },
        { title: "Stunts", icon: "mdi-map", to: "/stunts" },
        {
          title: "Patrols you've met",
          icon: "mdi-account-group",
          to: "/patrols",
        },
        // {
        //   title: "Monsters At AG",
        //   icon: "mdi-ghost",
        //   to: "/monster-hunt",
        // },
        { title: "Scan QR Code", icon: "mdi-qrcode", to: "/scan" },
        { title: "App & Data", icon: "mdi-cloud", to: "/app" },
        {
          title: "Upload Photos",
          icon: "mdi-image-plus",
          href: "https://cloud.snowdrift.com.au/s/ogsYfAe4Er4cDa9",
        },
      ],
      monsterAcronymIndex: 0,
    };
  },
  mounted() {
    /**
     * In 3.0.0 of @nuxtjs/pwa, a change was made to not prefetch all bundles on
     * app initialisation and instead rely on Nuxt's new Smart Fetch feature
     * which rel=preload's bundles as links to those pages become visible.
     *
     * While a great benefit for most use cases, this change is not conducive
     * to fully offline-capable applications because they need all the bundles cached
     * before the user goes to each and every page.[1]
     *
     * Some people suggest downgrading to 2.6.0 of @nuxtjs/pwa but this did not work
     * for me as the sw.js script was suddenly inaccessible after downgrading. [2]
     * It was getting generated correctly, the bundles were listed in the sw.js
     * script but would return a 404 when trying to browse to it.
     *
     * I investigated adding a workbox plugin to the sw.js script but the script seems
     * to be generated before webpack performs any bundling and thus the names of the
     * JS bundles are not known.
     *
     * The SSR'd HTML does include links to all JS bundles in the form of rel=preload
     * and rel=prefetch <link> tags. Vue SSR/Nuxt does provide two functions to help a
     * developer label scripts, styles, fonts, and images with the correct <link rel=>
     * attributes but, despite following the example of [3] the resultant HTML
     * did not change.
     *
     * Ultimately the snippet below was born; a dynamic snippet that converts all
     * rel=prefetch links to rel=preload. It also "uses" the preloaded content to avoid
     * Chome producing a warning about content not being used within a few seconds of
     * being preloaded.
     *
     * There may be a need in the future to expand this snippet to preload other content
     * eg fonts and styles, but for now, this seems to solve my issue.
     *
     * [1] https://github.com/nuxt-community/pwa-module/issues/306
     * [2] https://github.com/nuxt-community/pwa-module/issues/24
     * [3] https://github.com/nuxt/nuxt.js/issues/1508#issuecomment-325655533
     * [4] https://github.com/nuxt/nuxt.js/issues/1838
     */
    document.querySelectorAll("link[rel=prefetch]").forEach((el) => {
      if (el.getAttribute("href")?.endsWith(".js")) {
        el.setAttribute("as", "script");
        el.setAttribute("rel", "preload");

        const newScriptTag = document.createElement("script");
        newScriptTag.setAttribute("src", el.getAttribute("href") ?? "");
        newScriptTag.setAttribute("defer", "true");
        document.querySelector("body")?.appendChild(newScriptTag);
      }
    });
  },
  computed: {
    buildNumber() {
      return this.$config.version || "Unknown";
    },
    monsterAcronyms() {
      return this.$store.state.monsterAcronyms;
    },
    monsterAcronym() {
      return this.monsterAcronyms[this.monsterAcronymIndex];
    },
    clientLoaded() {
      if (process.server) {
        return false;
      }
      return true;
    },
    userSetupRequired() {
      const isPageSetup = [
        "/user/admin/setup",
        "/user/ag/setup",
        "/user/patrol/setup",
        "/user/stunt/setup",
      ].includes(this.$route.path);
      if (isPageSetup) {
        return false;
      }

      return this.$store.getters.userSetupRequired;
    },
  },
  watch: {
    $route: function () {
      this.monsterAcronymIndex =
        (this.monsterAcronyms.length * Math.random()) | 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.app-title {
  font-family: $heading-font-family;
  letter-spacing: 0.2rem;
  font-size: xx-large;
  color: #9e1c34;
  a {
    color: unset;
  }
}
</style>
