<template>
  <span>
    <v-chip small color="red accent-4">#{{ stunt.stuntNumber }}</v-chip>
    {{ stunt.name }}
  </span>
</template>

<script lang="ts">
export default {
  props: {
    stunt: {
      type: Object,
      required: true,
      validator: (stunt) => stunt._type === "stunt",
    },
  },
};
</script>
