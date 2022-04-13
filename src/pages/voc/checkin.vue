<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h3">VOC Checkpoint</v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item-group v-model="activeCheckinPeriod">
                <v-list-item
                  v-for="item in checkinPeriods"
                  :key="item.value"
                  :value="item.value"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.label }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="step === 'scan'">
      <v-col cols="12">
        <v-card>
          <qr-code-scan @valid-code="routeValidCode">
            <v-card-title class="text-h2">Scan QR code</v-card-title>
            <v-card-text v-if="scanMessage">{{ scanMessage }}</v-card-text>
          </qr-code-scan>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="step === 'question'">
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h3">{{ patrol.name }}</v-card-title>

          <v-card-subtitle class="text--secondary">
            Check-in this patrol
          </v-card-subtitle>

          <v-card-text>
            <v-btn block outlined color="warning" @click="clearPatrol">
              Change Patrol
            </v-btn>
          </v-card-text>
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
          v-model="checkin[question.storageKey]"
          :question="question"
        ></review-question>
      </v-col>

      <!-- Submit Checkin -->
      <v-col cols="12">
        <v-btn
          block
          outlined
          color="success"
          :disabled="!formValid"
          :loading="loading"
          @click="submitCheckin"
        >
          Check In
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { isValid } from "~/common/question";
import {
  Entity,
  EventLog,
  Question,
  CheckpointVocEnter,
  CheckpointVocExit,
} from "~/types";
import hasher from "object-hash";
import uuid4 from "uuid4";
import { names as patrol } from "~/store/patrol";

export default {
  data() {
    return {
      patrolId: null,
      step: "scan",
      activeCheckinPeriod: "friday:enter",
      checkinPeriods: [
        { label: "Friday - In", value: "friday:enter" },
        { label: "Saturday - Out", value: "saturday:exit" },
        { label: "Saturday - In", value: "saturday:enter" },
        { label: "Night Patrol - Out", value: "night:exit" },
        { label: "Night Patrol - In", value: "night:enter" },
        { label: "Sunday - Out", value: "sunday:exit" },
        { label: "Sunday - In", value: "sunday:enter" },
        { label: "Monday - Out", value: "monday:exit" },
      ],
      scanMessage: null,
      loading: false,
      checkin: {},
    };
  },
  computed: {
    patrol() {
      if (!this.patrolId) {
        return null;
      }
      return this.$store.getters[patrol.getters.getPatrol](this.patrolId);
    },
    questionGroup() {
      if (!this.activeCheckinPeriod) {
        return null;
      }

      if (this.activeCheckinPeriod.endsWith(":enter")) {
        return "checkpoint:voc:enter";
      }

      if (this.activeCheckinPeriod.endsWith(":exit")) {
        return "checkpoint:voc:exit";
      }

      return null;
    },
    questions(): Question[] {
      if (!this.questionGroup) {
        return [];
      }

      return this.$store.getters.checkpointVOCQuestions(this.questionGroup);
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
      { to: "/voc", label: "VOC" },
      { to: null, label: "Check In" },
    ]);

    this.initialiseCheckInSession();
  },
  watch: {
    questions: {
      deep: true,
      handler() {
        this.checkin = this.questions.reduce((acc, question) => {
          acc[question.storageKey] = "";
          return acc;
        }, {});
      },
    },
  },
  methods: {
    initialiseCheckInSession() {
      this.scanMessage = "";
      this.patrolId = null;
      this.step = "scan";
    },
    clearPatrol() {
      this.initialiseCheckInSession();
    },

    async routeValidCode(validEntity: Entity) {
      if (validEntity._type !== "patrol") {
        this.scanMessage = "Can haz Patrol?";
        return;
      }

      this.scanMessage = "";
      this.patrolId = validEntity.id;
      this.step = "question";
    },

    async submitCheckin() {
      if (!this.$useUser()) {
        await this.$createAlert({
          message: "You are not logged in, you can not submit a checkpoint",
        });
        return;
      }
      if (!this.patrol || !this.activeCheckinPeriod) {
        await this.$createAlert({
          message:
            "An internal error occurred, you can not submit a checkpoint",
        });
        return;
      }

      this.loading = true;

      const data: CheckpointVocEnter | CheckpointVocExit = this.checkin;

      data.period = this.activeCheckinPeriod;
      data.type = this.questionGroup;

      const logData: EventLog = {
        deduplicationId: uuid4(),
        version: new Date().toISOString(),
        hash: hasher(data),
        eventName: this.$config.eventName,
        type: this.questionGroup,
        recordingEntity: this.$useUser(
          (u) => ({ _type: u._type, id: u.id }),
          undefined
        ),
        referencedEntity: {
          _type: this.patrol._type,
          id: this.patrol.id,
        },
        data: data,
      };

      try {
        await this.$store.dispatch("persistEventLog", logData);

        await this.$createAlert({
          message: "Checkpointed",
          type: "success",
        });

        this.initialiseCheckInSession();
      } catch (e) {
        // alert should already have been made.
      }

      this.loading = false;
    },
  },
};
</script>
