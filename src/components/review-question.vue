<template>
  <v-card>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card-title>{{ question.heading }}</v-card-title>
        <v-card-subtitle class="text--secondary">
          {{ question.description }}
        </v-card-subtitle>
      </v-col>
      <v-col cols="6">
        <v-card-text>
          <v-slider
            v-model="data"
            min="1"
            :max="question.tickLabels.length"
            step="1"
            vertical
            persistent-hint
            :tick-labels="question.tickLabels"
            ticks="always"
            tick-size="4"
          ></v-slider>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
export default {
  props: {
    question: Object,
  },
  data() {
    return { data: 0 };
  },
  watch: {
    data() {
      this.$emit("input", this.data);
    },
  },
};
</script>
