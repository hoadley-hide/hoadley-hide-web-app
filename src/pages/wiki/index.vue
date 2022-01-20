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
              <v-list-item
                v-for="article in tagGroup.articles"
                :key="article.name"
                :to="`/wiki/${article.slug}`"
              >
                <span class="tab-title-left-align">{{ article.name }}</span>
              </v-list-item>
            </span>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
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
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Wiki" },
    ]);
  },
};
</script>

<style scoped>
.tab-title-left-align {
  width: 100%;
  text-align: left;
}
</style>
