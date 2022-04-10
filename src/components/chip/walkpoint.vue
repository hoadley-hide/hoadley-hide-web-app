<template>
  <span>
    <v-chip small color="red accent-4">#{{ walkpoint.walkpointLetter }}</v-chip>
    {{ walkpoint.name }}
  </span>
</template>

<script lang="ts">
export default {
  props: {
    walkpoint: {
      type: Object,
      required: true,
      validator: (walkpoint) => walkpoint._type === "walkpoint",
    },
  },
};
</script>
