<template>
  <v-row>
    <client-only>
      <span
        v-if="
          (activeUser && activeUser._type === 'patrol') ||
          (activeUser && activeUser._type === 'admin')
        "
      >
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
            v-for="question in reviewQuestions"
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
      </span>
      <v-col cols="12" v-else>
        <v-card>
          <v-card-title class="text-h3">{{ stunt.name }}</v-card-title>

          <v-card-subtitle>Review this stunt</v-card-subtitle>
          <v-card-text>
            Why sir, are you here? You are not a patrol user. Buzz off.
          </v-card-text>
        </v-card>
      </v-col>
    </client-only>
  </v-row>
</template>

<script lang="ts">
import { createAlert, setBreadcrumbs } from "~/common/helper-factories";
import { AppUserEntity, EventLogInput } from "~/types";

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
    reviewQuestions() {
      return this.$store.state.reviewQuestions;
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
    submitReview() {
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

      console.log(JSON.stringify(this.review));

      const logData: EventLogInput = {
        deduplicationId: "",
        eventName: "hh22",
        type: "stuntReview",
        recordingEntity: this.activeUser.id,
        referencedEntity: this.stunt.id,
        data: {},
      };
      console.log(logData);
      // this.$store.dispatch("persistEventLog", logData);
    },
  },
};
</script>
