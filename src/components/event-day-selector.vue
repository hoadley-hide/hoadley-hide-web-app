<template>
  <v-select
    v-model="data"
    :items="days"
    :label="label"
    item-text="label"
    item-value="value"
  ></v-select>
</template>

<script lang="ts">
export default {
  props: {
    label: { type: String, default: "Show day" },
  },
  data() {
    return {
      data: "whole-event",
      days: [
        { label: "Saturday", value: "saturday" },
        { label: "Sunday", value: "sunday" },
        { label: "Whole Event", value: "whole-event" },
      ],
    };
  },
  computed: {
    eventDay() {
      return this.$store.getters.eventDay;
    },
  },
  watch: {
    eventDay: {
      immediate: true,
      handler(newValue) {
        this.data = newValue;
      },
    },
    data(newValue) {
      this.$store.commit("setEventDay", newValue);
    },
  },
};
</script>
