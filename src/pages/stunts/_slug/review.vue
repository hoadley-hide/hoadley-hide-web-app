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
            <v-card>
              <form-vertical-slider
                v-model="review[question.storageKey]"
                :tick-labels="question.tickLabels"
              >
                <v-card-title>{{ question.heading }}</v-card-title>
                <v-card-subtitle class="text--secondary">
                  {{ question.description }}
                </v-card-subtitle>
              </form-vertical-slider>
            </v-card>
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
import { setBreadcrumbs } from "~/common/helper-factories";
import { AppUserEntity } from "~/types";

export default {
  validate({ params, store }) {
    return store.getters.stunt(params.slug);
  },
  data() {
    return {
      review: {},
      funness: 0,
      enthusiasm: 0,
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
};
</script>
