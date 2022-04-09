<template>
  <v-card color="green darken-4">
    <v-card-title class="text-h5">Your progress!</v-card-title>
    <v-card-text class="text-center d-flex flex-column">
      <span class="text-h2"> {{ stats.scanned }} / {{ stats.total }} </span>
      <span> You've met {{ stats.scanned }} of {{ stats.total }} patrols </span>
    </v-card-text>

    <v-card-text
      v-if="$useUser((u) => u._type !== 'patrol')"
      class="text-center d-flex flex-column"
    >
      <span>Time patrols have spent at your stunt:</span>
      <span class="text-h2">
        {{ checkpointDurations.total }}
      </span>
      <span> On average: {{ checkpointDurations.average }} </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { names as patrol } from "~/store/patrol";

export default {
  computed: {
    stats() {
      return this.$store.getters[patrol.getters.stats];
    },
    checkpointDurations() {
      return this.$store.getters["checkpoint/checkpointStuntVisitDurations"];
    },
  },
};
</script>
