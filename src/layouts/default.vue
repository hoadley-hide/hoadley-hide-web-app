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
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          nuxt
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
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
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
    };
  },
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