<template>
  <v-btn
    block
    outlined
    nuxt
    @click="submitCapture"
    :loading="loading"
    :disabled="disabled"
    :color="colour"
  >
    {{ label }}
  </v-btn>
</template>

<script lang="ts">
import { CheckpointWalkpointCapture, EventLog } from "~/types";
import hasher from "object-hash";
import uuid4 from "uuid4";
import { DateTime } from "luxon";

export default {
  props: {
    walkpoint: {
      type: Object,
      required: true,
      validator: (walkpoint) => walkpoint._type === "walkpoint",
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    walkpointCheckInStatus(): string {
      if (!this.walkpoint) {
        return "not-available";
      }
      if (!this.$auth(["patrol:canCheckpoint:walkpoint:capture"])) {
        return "not-available";
      }

      return this.$store.getters["checkpoint/walkpointCheckInStatus"](
        this.$useUser(),
        this.walkpoint
      );
    },
    disabled() {
      switch (this.walkpointCheckInStatus as unknown as string) {
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
      switch (this.walkpointCheckInStatus as unknown as string) {
        case "not-available":
          return "Unable to Capture Walkpoint";
        case "incomplete":
          return "Capture Walkpoint";
        case "inflight":
          return "Continute Capture of Walkpoint";
        case "complete":
          return "Already Captured Walkpoint";
        default:
          return `Unknown status ${this.walkpointCheckInStatus}`;
      }
    },
    colour() {
      switch (this.walkpointCheckInStatus as unknown as string) {
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
  methods: {
    async submitCapture() {
      if (this.walkpointCheckInStatus !== "incomplete") {
        await this.$createAlert({
          message: `Bruv nah, status is ${this.walkpointCheckInStatus}`,
        });
        return;
      }
      if (!this.$useUser()) {
        await this.$createAlert({
          message: "You are not logged in, you can not submit a capture",
        });
        return;
      }
      if (!this.walkpoint) {
        await this.$createAlert({
          message: "An internal error occurred, you can not submit a capture",
        });
        return;
      }

      this.loading = true;

      const capture: CheckpointWalkpointCapture = {
        type: "checkpoint:walkpoint:capture",
        "walkpoint-capture-time": DateTime.now().toISO(),
      };

      const logData: EventLog = {
        deduplicationId: uuid4(),
        version: new Date().toISOString(),
        hash: hasher(capture),
        eventName: this.$config.eventName,
        type: "checkpoint:walkpoint:capture",
        recordingEntity: this.$useUser(
          (u) => ({ _type: u._type, id: u.id }),
          undefined
        ),
        referencedEntity: {
          _type: this.walkpoint._type,
          id: this.walkpoint.id,
        },
        data: capture,
      };

      try {
        await this.$store.dispatch("persistEventLog", logData);
      } catch (e) {
        // alert should already have been made.
      }

      this.loading = false;
    },
  },
};
</script>
