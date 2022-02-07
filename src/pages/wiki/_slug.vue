<template>
  <v-row justify="center">
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ wikiArticle.name }}</v-card-title>

        <v-card-text v-html="wikiArticle.content.html"> </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  validate({ params, store }) {
    return store.getters.wikiArticle(params.slug);
  },
  data() {
    return {};
  },
  computed: {
    wikiArticle() {
      return this.$store.getters.wikiArticle(this.$route.params.slug);
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/wiki", label: "Wiki" },
      { to: null, label: this.wikiArticle.shortName },
    ]);
  },
};
</script>
