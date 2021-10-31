<template>
  <div>
    <v-card>
      <v-card-title>M.O.N.S.T.E.R Guild</v-card-title>
      <v-card-subtitle>What's the worst that could happen?</v-card-subtitle>

      <v-card-text>
        <p>
          Today, you arrive at our humble settlement. Let me show you around.
        </p>
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
          title: "Check which stunts are open",
          icon: "mdi-view-dashboard",
          to: "/stunts",
        },
        { title: "What can I do next?", icon: "mdi-forum", to: "/friday" },
        {
          title: "My feet are hurting...",
          icon: "mdi-forum",
          to: "/first-aid",
        },
        { title: "About", icon: "mdi-forum", to: "/about" },
      ],
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: null, label: "Home" },
    ]);
  },
};
</script>
