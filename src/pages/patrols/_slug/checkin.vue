<template>
  <v-form model="checkin" class="checkin-form">
    <v-row v-if="$auth(['patrol:canCheckpoint:stunt:visit'])">
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h3">{{ patrol.name }}</v-card-title>

          <v-card-subtitle class="text--secondary">
            Checkin this patrol
          </v-card-subtitle>
        </v-card>
      </v-col>

      <!-- Questions -->
      <v-col
        cols="12"
        md="6"
        v-for="(question, i) in questions"
        v-bind:key="question.heading"
      >
        <review-question
          v-model="checkin[question.storageKey]"
          :question="question"
        ></review-question>

        <v-btn
          v-if="i % 2"
          block
          text
          color="success"
          class="mt-5"
          @click="() => submitCheckin(true, true)"
        >
          Save &amp; Return later
        </v-btn>
      </v-col>

      <!-- Submit Checkin -->
      <v-col cols="12">
        <v-btn
          block
          outlined
          color="success"
          :disabled="!formValid"
          @click="() => submitCheckin(false, true)"
        >
          Submit now
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h3">{{ patrol.name }}</v-card-title>

          <v-card-subtitle>Check-in this patrol</v-card-subtitle>
          <v-card-text>
            Why sir, are you here? You are not a stunt user. Buzz off.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { isValid } from "~/common/question";
import { Checkpoint, EventLog, Question } from "~/types";

import uuid4 from "uuid4";

export default {
  validate({ params, store }) {
    return store.getters.patrol(params.slug);
  },
  data() {
    return {
      checkin: {},
      progressDebouncer: null,
    };
  },
  computed: {
    patrol() {
      return this.$store.getters.patrol(this.$route.params.slug);
    },
    questions(): Question[] {
      return this.$store.getters.checkpointStuntVisitQuestions.sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
    },
    partialCheckpoint() {
      return this.$store.getters["checkpoint/getPartial"](
        this.patrol,
        this.$useUser()
      );
    },
    formValid(): boolean {
      return this.questions.every((question) =>
        isValid(question, this.checkin[question.storageKey])
      );
    },
  },
  async mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/patrols", label: "Patrols" },
      { to: this.patrol.path, label: this.patrol.name },
      { to: null, label: "Check In" },
    ]);

    await this.initialiseCheckInSession();
  },
  watch: {
    checkin: {
      deep: true,
      handler(value) {
        this.dataChanged(value);
      },
    },
  },
  methods: {
    async initialiseCheckInSession() {
      if (!this.patrol || !this.$useUser()) {
        await this.$createAlert({
          message: "Something went wrong, you might have to reload your page",
          type: "error",
        });
        return;
      }

      // Get partial record out of the store.
      const partialCheckpoint: Checkpoint | null = this.partialCheckpoint;

      if (!partialCheckpoint) {
        // There is no existing checkpoint.

        this.checkin = this.questions.reduce((acc, question) => {
          acc[question.storageKey] = "";
          return acc;
        }, {});

        return;
      }

      // Rehydrate the form
      this.checkin = JSON.parse(JSON.stringify(partialCheckpoint.data));
    },

    async dataChanged(question) {
      if (this.progressDebouncer) {
        clearTimeout(this.progressDebouncer);
      }

      this.progressDebouncer = setTimeout(() => {
        this.submitCheckin(true, false);
      }, 500);
    },

    async submitCheckin(
      inProgressSubmit: boolean = false,
      close: boolean = false
    ) {
      if (!this.$useUser()) {
        this.$createAlert({
          message: "You are not logged in, you can not check in a patrol",
        });
      }
      if (!this.patrol) {
        this.$createAlert({
          message: "An internal error occurred, you can not check in a patrol",
        });
      }

      const deduplicationId =
        (this.partialCheckpoint as Checkpoint | null)?.id || uuid4();

      const data: Checkpoint["data"] = JSON.parse(JSON.stringify(this.checkin));
      data.type = "checkpoint:stunt:visit";

      const checkpoint: Checkpoint = {
        id: deduplicationId,
        patrol: this.patrol,
        recording: this.$useUser(),
        data: data,
      };

      if (inProgressSubmit) {
        // Add to inflight checkpoints
        await this.$store.dispatch("checkpoint/addInflight", checkpoint);
      }

      const logData: EventLog = {
        deduplicationId: deduplicationId,
        version: new Date().toISOString(),
        eventName: this.$config.eventName,
        type: "checkpoint:stunt:visit",
        recordingEntity: this.$useUser(
          (u) => ({ _type: u._type, id: u.id }),
          undefined
        ),
        referencedEntity: { _type: this.patrol._type, id: this.patrol.id },
        data: data,
      };

      await this.$store.dispatch("persistEventLog", logData);

      if (inProgressSubmit && close) {
        // Do not run validation, just move on.
        this.$router.push(this.patrol.path);
      }

      if (!inProgressSubmit) {
        // Complete submission if it is valid.
        if (this.formValid) {
          // Remove from inflight checkpoints
          await this.$store.dispatch("checkpoint/removeInflight", checkpoint);

          this.$router.push(this.patrol.path);
        } else {
          this.$createAlert({
            heading: "Some fields require attention",
            message:
              "Checkpoint can not be completed while fields require attention",
            type: "warning",
          });
          return;
        }
      }
    },
  },
};
</script>
