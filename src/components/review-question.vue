<template>
  <v-card>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card-title>{{ question.heading }}</v-card-title>
        <v-card-subtitle class="text--secondary">
          {{ question.description }}
        </v-card-subtitle>
      </v-col>
      <v-col :cols="question.reviewType === 'Rating' ? 6 : 12">
        <v-card-text>
          <v-slider
            v-if="question.reviewType === 'Rating'"
            v-model="data"
            min="1"
            :max="question.tickLabels.length"
            step="1"
            vertical
            :tick-labels="question.tickLabels"
            ticks="always"
            tick-size="4"
          ></v-slider>
          <v-text-field
            v-else-if="question.reviewType === 'ShortAnswer'"
            v-model="data"
          ></v-text-field>
          <v-textarea
            v-else-if="question.reviewType === 'LongAnswer'"
            v-model="data"
            :placeholder="question.description"
            outlined
            counter
          ></v-textarea>
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
    return { data: "" };
  },
  watch: {
    data() {
      this.$emit("input", this.data);
    },
  },
};
</script>
