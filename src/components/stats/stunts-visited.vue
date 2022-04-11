<template>
  <v-card color="green darken-4">
    <v-card-title class="text-h5">Your progress!</v-card-title>
    <v-card-text class="text-center d-flex flex-column">
      <span class="text-h2"> {{ stats.scanned }} / {{ stats.total }} </span>
      <span>
        You've visited {{ stats.scanned }} of {{ stats.total }} stunts
      </span>
    </v-card-text>

    <v-card-text
      v-if="$useUser((u) => u._type === 'patrol')"
      class="text-center d-flex flex-column"
    >
      <span>Time spent at stunts:</span>
      <span class="text-h2">
        {{ checkpointDurations.total }}
      </span>
      <span> On average: {{ checkpointDurations.average }} </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { names as stunt } from "~/store/stunt";

export default {
  computed: {
    stats() {
      return this.$store.getters[stunt.getters.stats];
    },
    checkpointDurations() {
      return this.$store.getters["checkpoint/checkpointStuntVisitDurations"];
    },
  },
};
</script>
