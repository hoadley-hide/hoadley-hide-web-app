<template>
  <span class="d-flex align-center">
    <v-chip small color="pink darken-4">#{{ patrol.patrolNumber }}</v-chip>
    <span class="px-2">{{ patrol.name }}</span>
    <span
      v-if="$useUser((u) => u._type !== 'patrol')"
      class="ml-auto text-no-wrap"
      :class="checkInStatus.colour"
    >
      {{ checkInStatus.label }}
    </span>
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
  computed: {
    checkInStatus() {
      const status = this.$store.getters["checkpoint/patrolCheckInStatus"](
        this.patrol,
        this.$useUser()
      );

      if (status === "incomplete") {
        return { colour: "red--text", label: "Not Checked In" };
      } else if (status === "inflight") {
        return { colour: "orange--text", label: "Continue" };
      } else if (status === "complete") {
        return { colour: "green--text", label: "Checked In" };
      }
    },
  },
};
</script>
