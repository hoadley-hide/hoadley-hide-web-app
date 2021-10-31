<template>
  <v-container class="breadcrumb-container">
    <v-row>
      <v-col class="pb-0">
        <v-card>
          <v-card-text class="d-flex flex-row justify-space-between">
            <ol class="pl-0">
              <li
                class="d-inline"
                v-for="(breadcrumb, i) in breadcrumbs"
                v-bind:key="breadcrumb.label"
              >
                <nuxt-link
                  v-if="breadcrumb.to !== null"
                  :to="breadcrumb.to"
                  class="text--primary"
                  >{{ breadcrumb.label }}</nuxt-link
                >
                <span v-else class="text--secondary">{{
                  breadcrumb.label
                }}</span>
                <template v-if="i !== breadcrumbs.length - 1"> / </template>
              </li>
            </ol>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { AppBreadcrumb } from "~/common/breadcrumb";

export default {
  name: "breadcrumbs",
  computed: {
    breadcrumbs(): AppBreadcrumb[] {
      return this.$store.getters.breadcrumbs;
    },
  },
};
</script>

<style lang="css" scoped>
.breadcrumb-container .v-card__text {
  font-size: 1.2rem;
}
.breadcrumb-container ol {
  list-style-type: none;
}
.breadcrumb-container ol li a {
  text-decoration: none;
}
.breadcrumb-container ol li a:hover {
  text-decoration: underline !important;
}
</style>