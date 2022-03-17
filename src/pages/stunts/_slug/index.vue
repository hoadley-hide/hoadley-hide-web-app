<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ stunt.name }}</v-card-title>

        <v-card-text v-html="stunt.description.html"></v-card-text>

        <v-card-text>Find this stunt: {{ stunt.location }}</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" v-show="$auth(['stunt:canReview'])">
      <v-card>
        <v-card-title class="text-h4 d-flex flex-nowrap">
          <!-- <v-icon left large>mdi-review</v-icon> -->
          <span>Leave feedback</span>
        </v-card-title>
        <v-card-text v-if="!stuntReviewCompleted">
          <p>Bonus points? Complete this review for 10 points</p>

          <v-btn color="info" block nuxt :to="`${stunt.path}/review`">
            Enter feedback
          </v-btn>
        </v-card-text>
        <v-card-text v-else>
          <p>You have already submitted feedback, thank you.</p>
          <v-btn nuxt text block to="/reviews">
            See feedback you have left
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" v-show="$auth(['stunt:canShare'])">
      <v-card>
        <v-card-title class="text-h4 d-flex flex-nowrap">
          <v-icon left large>mdi-qrcode</v-icon>
          <span>Share this stage</span>
        </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <qr-code
            :entity="{
              code: stunt.code,
              path: stunt.path,
              name: stunt.name,
            }"
          ></qr-code>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Stunt } from "~/types";

export default {
  validate({ params, store }) {
    return store.getters.stunt(params.slug);
  },
  data() {
    return {};
  },
  computed: {
    stunt(): Stunt[] {
      return this.$store.getters.stunt(this.$route.params.slug);
    },
    stuntReviewCompleted(): boolean {
      return this.$store.getters.stuntReviewCompleted(this.stunt);
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/stunts", label: "Stunts" },
      { to: null, label: this.stunt.name },
    ]);
  },
};
</script>
