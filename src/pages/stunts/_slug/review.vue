<template>
  <v-row>
    <authorised :allow="['stunt:canReview']">
      <template v-slot:default>
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h3">{{ stunt.name }}</v-card-title>

            <v-card-subtitle class="text--secondary">
              Review this stunt
            </v-card-subtitle>

            <v-card-text>
              By giving us a review, you're helping shape Hoadley Hide into the
              future.
            </v-card-text>
          </v-card>
        </v-col>

        <v-form model="review">
          <!-- Questions -->
          <v-col
            cols="12"
            v-for="question in questions"
            v-bind:key="question.heading"
          >
            <review-question
              @input="(value) => (review[question.storageKey] = value)"
              :question="question"
            ></review-question>
          </v-col>

          <!-- Submit Review -->
          <v-col cols="12">
            <v-btn block color="success" @click="submitReview">
              Submit Review
            </v-btn>
          </v-col>
        </v-form>
      </template>
      <template v-slot:blocked>
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h3">{{ stunt.name }}</v-card-title>

            <v-card-subtitle>Review this stunt</v-card-subtitle>
            <v-card-text>
              Why sir, are you here? You are not a patrol user. Buzz off.
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </authorised>
  </v-row>
</template>

<script lang="ts">
import { createAlert, setBreadcrumbs } from "~/common/helper-factories";
import { AppUserEntity, EventLog } from "~/types";

import uuid4 from "uuid4";

export default {
  validate({ params, store }) {
    return store.getters.stunt(params.slug);
  },
  data() {
    return {
      review: {},
    };
  },
  computed: {
    stunt() {
      return this.$store.getters.stunt(this.$route.params.slug);
    },
    questions() {
      return this.$store.state.questions;
    },
    activeUser(): AppUserEntity | null {
      return this.$store.getters.user;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/stunts", label: "Stunts" },
      { to: this.stunt.path, label: this.stunt.name },
      { to: null, label: "Review" },
    ]);
  },
  methods: {
    async submitReview() {
      if (!this.activeUser) {
        createAlert(this.$store, {
          message: "You are not logged in, you can not submit a review",
        });
      }
      if (!this.stunt) {
        createAlert(this.$store, {
          message: "An internal error occurred, you can not submit a review",
        });
      }

      const logData: EventLog = {
        deduplicationId: uuid4(),
        eventName: this.$config.eventName,
        type: "review:stunt",
        recordingEntity: {
          _type: this.activeUser._type,
          id: this.activeUser.id,
        },
        referencedEntity: { _type: this.stunt._type, id: this.stunt.id },
        data: this.review,
      };

      await this.$store.dispatch("persistEventLog", logData);

      this.$router.push(this.stunt.path);
    },
  },
};
</script>
