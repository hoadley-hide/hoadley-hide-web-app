<template>
  <v-form model="checkin" class="checkin-form">
    <v-row v-show="$auth(['patrol:canCheckpoint:stunt:visit'])">
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
        v-for="question in questions"
        v-bind:key="question.heading"
      >
        <review-question
          @input="
            (value) => {
              checkin[question.storageKey] = value;
              dataChanged(question);
            }
          "
          :question="question"
        ></review-question>
      </v-col>

      <!-- Submit Checkin -->
      <v-col cols="12">
        <v-btn block color="success" @click="submitCheckin">
          Submit Checkin
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-show="!$auth(['patrol:canCheckPointStunt'])">
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
import { createAlert, setBreadcrumbs } from "~/common/helper-factories";
import { AppUserEntity, EventLog } from "~/types";

import uuid4 from "uuid4";

export default {
  validate({ params, store }) {
    return store.getters.patrol(params.slug);
  },
  data() {
    return {
      checkInSessionUUID: "",
      checkin: {},
    };
  },
  computed: {
    patrol() {
      return this.$store.getters.patrol(this.$route.params.slug);
    },
    questions() {
      return this.$store.getters.checkpointStuntVisitQuestions.sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
    },

    activeUser(): AppUserEntity | null {
      return this.$store.getters.user;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/patrols", label: "Patrols" },
      { to: this.patrol.path, label: this.patrol.name },
      { to: null, label: "Check In" },
    ]);

    this.initialiseCheckInSession();
  },
  methods: {
    initialiseCheckInSession() {
      this.checkInSessionUUID = uuid4();
    },
    async dataChanged(question) {},
    async submitCheckin() {
      if (!this.activeUser) {
        createAlert(this.$store, {
          message: "You are not logged in, you can not check in a patrol",
        });
      }
      if (!this.patrol) {
        createAlert(this.$store, {
          message: "An internal error occurred, you can not check in a patrol",
        });
      }

      const logData: EventLog = {
        deduplicationId: uuid4(),
        eventName: this.$config.eventName,
        type: "checkpoint:stunt:visit",
        recordingEntity: {
          _type: this.activeUser._type,
          id: this.activeUser.id,
        },
        referencedEntity: { _type: this.patrol._type, id: this.patrol.id },
        data: this.checkin,
      };

      await this.$store.dispatch("persistEventLog", logData);

      this.$router.push(this.patrol.path);
    },
  },
};
</script>
