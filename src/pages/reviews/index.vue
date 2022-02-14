<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Stunt Reviews</v-card-title>

        <v-card-text>List of reviews</v-card-text>
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
                no-action
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
                </template>
                <v-list-item
                  v-for="question in reviewQuestions"
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
import { authorised } from "~/common/authorisation";
import { setBreadcrumbs } from "~/common/helper-factories";
import { EventLog, ReviewQuestion } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    reviews(): EventLog[] {
      if (!authorised(this.$store, ["authenticated"])) {
        return [];
      }

      if (authorised(this.$store, ["review:seeRecordedBySelf"])) {
        return this.$store.getters.reviewsRecordedBySelf;
      }

      if (authorised(this.$store, ["review:seeReferencingSelf"])) {
        return this.$store.getters.reviewsReferencingSelf;
      }

      if (authorised(this.$store, ["review:seeAll"])) {
        return this.$store.state.reviews;
      }

      return [];
    },
    reviewQuestions(): ReviewQuestion[] {
      return this.$store.state.reviewQuestions;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Reviews" },
    ]);
  },
};
</script>
