<template>
  <v-btn
    block
    outlined
    nuxt
    :to="`${patrol.path}/checkin`"
    :disabled="disabled"
    :color="colour"
  >
    {{ label }}
  </v-btn>
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
    patrolCheckInStatus(): string {
      if (!this.patrol) {
        return "not-available";
      }
      if (!this.$auth(["patrol:canCheckpoint:stunt:visit"])) {
        return "not-available";
      }

      return this.$store.getters["checkpoint/patrolCheckInStatus"](
        this.patrol,
        this.$useUser()
      );
    },
    disabled() {
      switch (this.patrolCheckInStatus as unknown as string) {
        case "not-available":
          return true;
        case "incomplete":
          return false;
        case "inflight":
          return false;
        case "complete":
          return true;
        default:
          return true;
      }
    },
    label() {
      switch (this.patrolCheckInStatus as unknown as string) {
        case "not-available":
          return "Unable to Check in Patrol";
        case "incomplete":
          return "Check in Patrol";
        case "inflight":
          return "Continute Check in of Patrol";
        case "complete":
          return "Already Checked in Patrol";
        default:
          return `Unknown status ${this.patrolCheckInStatus}`;
      }
    },
    colour() {
      switch (this.patrolCheckInStatus as unknown as string) {
        case "not-available":
          return ""; // default
        case "incomplete":
          return "green";
        case "inflight":
          return "orange";
        case "complete":
          return "red";
        default:
          return ""; //default
      }
    },
  },
};
</script>
