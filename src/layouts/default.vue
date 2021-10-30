<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>Hoadley Hide 2022</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link nuxt :to="item.to">
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
        <small class="red--text" v-if="$nuxt.isOffline">Offline</small>
        <small class="green--text" v-if="$nuxt.isOnline">Online</small>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn to="/emergency" icon nuxt>
        <v-icon>mdi-phone</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer app padless absolute>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-card flat tile width="100%" height="100%" class="text-center text-sm-left">
            <v-card-text class="white--text">{{ monsterAcronym }}</v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card flat tile width="100%" height="100%" class="text-center text-sm-right">
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
        { title: "Stunts", icon: "mdi-view-dashboard", to: "/stunts" },
        { title: "About", icon: "mdi-forum", to: "/about" },
      ],
      monsterAcronymIndex: 0,
    };
  },
  computed: {
    monsterAcronyms() {
      return this.$store.state.monsterAcronyms

    },
    monsterAcronym() {
      return this.monsterAcronyms[this.monsterAcronymIndex];
    }
  },
  watch: {
    '$route': function () {
      this.monsterAcronymIndex = this.monsterAcronyms.length * Math.random() | 0
    }
  }
};
</script>


<style lang="scss" scoped>
@import "~vuetify/src/styles/styles.sass";
.app-title {
  font-family: $heading-font-family;
  letter-spacing: 0.2rem;
  font-size: xx-large;
  a {
    color: unset;
  }
}
</style>
@import "~vuetify/src/styles/styles.sass";
.app-title {
  font-family: $heading-font-family;
  letter-spacing: 0.2rem;
  font-size: xx-large;
  a {
    color: unset;
  }
}
