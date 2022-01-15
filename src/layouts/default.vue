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

      <v-btn to="/emergency" icon nuxt>
        <v-icon>mdi-phone</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <breadcrumbs></breadcrumbs>

      <user-requires-setup v-if="userSetupRequired"></user-requires-setup>

      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <alerts></alerts>

    <v-footer app padless absolute>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
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
        <v-col cols="12" sm="6">
          <v-card
            flat
            tile
            width="100%"
            height="100%"
            class="text-center text-sm-right"
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

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: "Home", icon: "mdi-view-dashboard", to: "/" },
        { title: "Stages", icon: "mdi-seat", to: "/event" },
        { title: "Stunts", icon: "mdi-view-dashboard", to: "/stunts" },
        { title: "Patrols", icon: "mdi-account-group", to: "/patrols" },
        { title: "About", icon: "mdi-forum", to: "/about" },
        { title: "Scan", icon: "mdi-qrcode", to: "/scan" },
        { title: "Data Activity", icon: "mdi-refresh", to: "/data" },
        {
          title: "Upload Photos",
          icon: "mdi-image-plus",
          href: "https://cloud.snowdrift.com.au/s/ogsYfAe4Er4cDa9",
        },
      ],
      monsterAcronymIndex: 0,
    };
  },
  computed: {
    buildNumber() {
      return process.env.PACKAGE_VERSION || "Unknown";
    },
    monsterAcronyms() {
      return this.$store.state.monsterAcronyms;
    },
    monsterAcronym() {
      return this.monsterAcronyms[this.monsterAcronymIndex];
    },
    userSetupRequired() {
      const isPageSetup = ["/user/stunt/setup", "/user/patrol/setup"].includes(
        this.$route.path
      );
      if (isPageSetup) {
        return false;
      }

      const isUserDefined = !!this.$store.getters.user;
      if (isUserDefined) {
        return false;
      }

      return true;
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
