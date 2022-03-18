<template>
  <div>
    <v-row v-show="$auth(['stunt:canReview'])">
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

      <v-col v-if="stuntReviewCompleted" cols="12">
        <v-card>
          <v-card-text class="text-red">
            You have already submitted a review for this stunt.
          </v-card-text>

          <v-btn block text nuxt :to="`${stunt.path}`">Back to Stunt</v-btn>
        </v-card>
      </v-col>

      <v-form model="review" v-else>
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
    </v-row>
    <v-row v-show="$auth([], ['stunt:canReview'])">
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h3">{{ stunt.name }}</v-card-title>

          <v-card-subtitle>Review this stunt</v-card-subtitle>
          <v-card-text>
            Why sir, are you here? You are not a patrol user. Buzz off.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { EventLog } from "~/types";

import hasher from "object-hash";
import uuid4 from "uuid4";

export default {
  validate({ params, store }) {
    return store.getters.stunt(params.slug);
  },
  data() {
    return {
      review: {},
      submissionInProgress: false,
    };
  },
  computed: {
    stunt() {
      return this.$store.getters.stunt(this.$route.params.slug);
    },
    questions() {
      return this.$store.getters.reviewQuestions;
    },
    stuntReviewCompleted(): boolean {
      return (
        !this.submissionInProgress &&
        this.$store.getters.stuntReviewCompleted(this.stunt)
      );
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/stunts", label: "Stunts" },
      { to: this.stunt.path, label: this.stunt.name },
      { to: null, label: "Review" },
    ]);
  },
  methods: {
    async submitReview() {
      this.submissionInProgress = true;
      if (!this.$useUser()) {
        await this.$createAlert({
          message: "You are not logged in, you can not submit a review",
        });
      }
      if (!this.stunt) {
        await this.$createAlert({
          message: "An internal error occurred, you can not submit a review",
        });
      }

      const logData: EventLog = {
        deduplicationId: uuid4(),
        version: new Date().toISOString(),
        hash: hasher(this.review),
        eventName: this.$config.eventName,
        type: "review:stunt",
        recordingEntity: this.$useUser(
          (u) => ({ _type: u._type, id: u.id }),
          undefined
        ),
        referencedEntity: { _type: this.stunt._type, id: this.stunt.id },
        data: this.review,
      };

      try {
        await this.$store.dispatch("persistEventLog", logData);
      } catch (e) {
        // alert should already have been made.
      }

      this.$router.push(this.stunt.path);
      this.submissionInProgress = false;
    },
  },
};
</script>
