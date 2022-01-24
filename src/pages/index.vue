<template>
  <div>
    <v-card>
      <v-card-title
        class="
          text-h2 text-center text-sm-left
          d-flex
          justify-space-around justify-sm-start
        "
      >
        M.O.N.S.T.E.R Hunters Guild
      </v-card-title>
      <v-card-subtitle class="text-subtitle-1 font-italic">
        What's the worst that could happen?
      </v-card-subtitle>

      <v-card-text>
        <p>Today, you arrive at our humble village. Let me show you around.</p>
      </v-card-text>

      <v-card-text>
        <v-list>
          <v-list-item
            v-for="item in links"
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
              <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  data() {
    return {
      drawer: false,
      links: [
        {
          title: "Stunts",
          subtitle: "See the stunts you've visited",
          icon: "mdi-map-clock",
          to: "/stunts",
        },
        {
          title: "The Adventure",
          subtitle: "What comes next?",
          icon: "mdi-shield-sword",
          to: "/event",
        },
        {
          title: "First Aid",
          subtitle: "My feet are hurting...",
          icon: "mdi-medical-bag",
          to: "/first-aid",
        },
        { title: "Wiki", icon: "mdi-information", to: "/wiki" },
      ],
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [{ to: null, label: "Home" }]);
  },
};
</script>
