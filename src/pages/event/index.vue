<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>Stages</v-card-title>

        <v-card-text>Where are we up to in the event?</v-card-text>
        <v-card-text class="warning--text">
          Note: Access to items on this page will only be shown after the QR
          code has been scanned
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="stage in eventStages"
              :key="stage.name"
              :to="`/event/${stage.slug}`"
              class="py-2"
            >
              <div class="d-flex flex-column align-stretch" style="width: 100%">
                <span class="subtitle-1 font-bold">{{ stage.name }}</span>
                <div class="d-flex flex-nowrap justify-space-between">
                  <span class="d-inline-block text-truncate font-italic">
                    {{ stage.descriptionText }}
                  </span>
                  <div class="pl-3 text-no-wrap">
                    {{ stage.startTime | datetime }}
                  </div>
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  data() {
    return {};
  },
  computed: {
    eventStages() {
      return this.$store.state.eventStages;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Event" },
    ]);
  },
};
</script>
