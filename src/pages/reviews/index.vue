<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Stunt Reviews</v-card-title>

        <v-card-text>List of reviews</v-card-text>
        <v-card-text>
          <v-btn
            block
            text
            color="info"
            @click="getReviews()"
            :loading="loading.getReviews"
          >
            Refresh Data
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <client-only placeholder="Loading reviews">
            <v-list>
              <v-list-group
                v-for="review in reviews"
                :key="review.deduplicationId"
              >
                <template v-slot:activator>
                  <v-list-item-icon>
                    <v-icon :color="review.isPersisted ? '' : 'red'">
                      {{
                        review.isPersisted
                          ? review.referencedEntity.icon || "mdi-rate-review"
                          : "mdi-cloud-alert"
                      }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="py-2">
                    {{ review.recordingEntity.name }}
                    <div class="pl-4">reviews</div>
                    {{ review.referencedEntity.name }}
                  </v-list-item-title>
                  <v-list-item-action v-show="$auth(['review:canDelete'])">
                    <v-btn icon color="red" @click="handleDelete(review)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </template>
                <v-list-item
                  v-for="question in questions"
                  v-bind:key="question.storageKey"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ question.heading }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ question.description }}
                    </v-list-item-subtitle>
                    <span v-if="review.data[question.storageKey]">
                      <v-slider
                        v-if="question.reviewType === 'Rating'"
                        readonly
                        dense
                        hide-details
                        min="1"
                        :max="question.tickLabels.length"
                        :tick-labels="
                          question.tickLabels.map((x) =>
                            x.length > 3 ? x.substr(0, 3) + '..' : x
                          )
                        "
                        ticks="always"
                        tick-size="4"
                        :value="review.data[question.storageKey]"
                      ></v-slider>
                      <p v-else>
                        {{ review.data[question.storageKey] }}
                      </p>
                    </span>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>

              <v-list-item v-if="reviews.length === 0">
                <i>You have not left any reviews</i>
              </v-list-item>
            </v-list>
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { EventLog, Question } from "~/types";

export default {
  data() {
    return {
      loading: {},
    };
  },
  computed: {
    reviews(): EventLog[] {
      if (!this.$useUser()) {
        return [];
      }

      if (this.$auth(["review:seeRecordedBySelf"])) {
        return this.$store.getters.reviewsRecordedBySelf;
      }

      if (this.$auth(["review:seeReferencingSelf"])) {
        return this.$store.getters.reviewsReferencingSelf;
      }

      if (this.$auth(["review:seeAll"])) {
        return this.$store.getters.reviewQuestions;
      }

      return [];
    },
    questions(): Question[] {
      return this.$store.state.questions;
    },
  },
  async mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Reviews" },
    ]);

    // await this.getReviews();
  },
  methods: {
    async getReviews() {
      this.loading.getReviews = true;
      await this.$store.dispatch("fetchMyReviews");
      this.loading.getReviews = false;
    },
    async handleDelete(review: EventLog) {
      if (this.loading[review.deduplicationId]) {
        return;
      }

      this.loading[review.deduplicationId] = true;
      await this.$store.dispatch("deleteEventLog", review);
      this.loading[review.deduplicationId] = false;
    },
  },
};
</script>
