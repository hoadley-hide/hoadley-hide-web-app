<template>
  <v-row justify="center">
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ wikiArticle.name }}</v-card-title>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6">
      <v-expansion-panels v-model="expandedPanel">
        <v-expansion-panel
          v-for="content in wikiArticle.content"
          :key="content.tab"
        >
          <v-expansion-panel-header>
            {{ content.heading }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <span v-html="content.html"></span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn color="success" block nuxt to="/wiki">Back to Wiki</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { WikiArticle } from "~/types";

export default {
  validate({ params, store }) {
    return store.getters.wikiArticle(params.slug);
  },
  data() {
    return { expandedPanel: 1 };
  },
  computed: {
    wikiArticle(): WikiArticle {
      return this.$store.getters.wikiArticle(this.$route.params.slug);
    },
  },
  watch: {
    expandedPanel(newTab) {
      return this.updateTabQuery(newTab);
    },
  },
  watchQuery(newQuery, oldQuery) {
    return this.readTabFromQuery(newQuery.tab);
  },
  mounted() {
    this.readTabFromQuery(this.$route.query.tab);

    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/wiki", label: "Wiki" },
      { to: null, label: this.wikiArticle.shortName },
    ]);
  },
  methods: {
    readTabFromQuery(tabName: string) {
      const tabIndex = this.wikiArticle.content.findIndex(
        (content) => content.tab === tabName
      );

      if (tabIndex && this.expandedPanel !== tabIndex) {
        this.expandedPanel = tabIndex;
      }
    },
    updateTabQuery(tabIndex: string) {
      const tabName = this.wikiArticle.content[tabIndex]?.tab;

      if (tabName && this.$route.query.tab !== tabName) {
        this.$router.replace({ query: { tab: tabName } });
      }
    },
  },
};
</script>
