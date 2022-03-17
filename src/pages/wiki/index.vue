<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Wiki</v-card-title>

        <v-card-text>
          Check out this cool info about Hoadley Hide and Hiking
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-list dense>
            <span
              v-for="tagGroup in wikiArticlesGroupedByTag"
              :key="tagGroup.tagName"
            >
              <v-subheader>{{ tagGroup.tagName }}</v-subheader>
              <v-list-group
                v-for="article in tagGroup.articles"
                :key="article.slug"
                :to="`/wiki/${article.slug}`"
              >
                <template v-slot:activator>
                  <v-list-item-title>{{ article.name }}</v-list-item-title>
                </template>
                <v-list-item
                  v-for="content in article.content"
                  :key="content.text"
                  :to="`${article.path}?tab=${content.tab}`"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="text--secondary">
                    <i> {{ content.heading }} </i>
                  </v-list-item-title>
                </v-list-item>
              </v-list-group>
            </span>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { WikiArticle } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    wikiArticlesGroupedByTag(): { tagName: string; articles: WikiArticle[] }[] {
      const articlesByTag: Record<string, WikiArticle[]> = {};

      this.$store.state.wikiArticles.forEach((wikiArticle: WikiArticle) =>
        wikiArticle.tags.forEach((tag) => {
          articlesByTag[tag] = articlesByTag[tag] || [];
          articlesByTag[tag].push(wikiArticle);
        })
      );

      const arrayOfTags = Object.entries(articlesByTag).map(
        ([tagName, articles]): { tagName: string; articles: WikiArticle[] } => {
          return {
            tagName: tagName,
            articles: articles.sort((a, b) => a.name.localeCompare(b.name)),
          };
        }
      );

      return arrayOfTags.sort((a, b) => a.tagName.localeCompare(b.tagName));
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: null, label: "Wiki" },
    ]);
  },
};
</script>

<style scoped>
.v-list-item__icon {
  margin-right: 0px !important;
}
</style>
