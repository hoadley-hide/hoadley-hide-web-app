<template>
  <v-card color="green darken-4">
    <v-card-title class="text-h5">Your progress!</v-card-title>
    <v-card-text class="text-center d-flex flex-column">
      <span class="text-h2"> {{ stats.scanned }} / {{ stats.total }} </span>
      <span>
        You've visited {{ stats.scanned }} of {{ stats.total }} walkpoints
      </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { names as walkpoint } from "~/store/walkpoint";

export default {
  computed: {
    stats() {
      return this.$store.getters[walkpoint.getters.stats];
    },
  },
};
</script>
