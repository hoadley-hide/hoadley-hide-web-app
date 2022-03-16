<template>
  <span>
    <v-chip small color="pink darken-4">#{{ patrol.patrolNumber }}</v-chip>
    {{ patrol.name }}
  </span>
</template>

<script lang="ts">
export default {
  props: {
    patrol: {
      type: Object,
      required: true,
      validator: (patrol) => patrol._type === "patrol",
    },
  },
};
</script>
