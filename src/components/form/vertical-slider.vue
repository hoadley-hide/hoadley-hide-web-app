<template>
  <v-row no-gutters>
    <v-col cols="12">
      <slot></slot>
    </v-col>
    <v-col cols="6">
      <v-card-text>
        <v-slider
          v-model="data"
          min="1"
          :max="tickLabels.length"
          step="1"
          vertical
          persistent-hint
          :tick-labels="tickLabels"
          ticks="always"
          tick-size="4"
        ></v-slider>
      </v-card-text>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  props: {
    value: Number,
    tickLabels: Array,
  },
  data() {
    return { data: 0 };
  },
  watch: {
    value() {
      this.$emit("input", this.value);
    },
  },
};
</script>
