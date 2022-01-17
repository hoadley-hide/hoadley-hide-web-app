<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Stages</v-card-title>

        <v-card-text>Where are we up to in the event?</v-card-text>
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
            <v-list-item v-if="eventStages.length === 0">
              <i>You have not discovered any stages</i>
            </v-list-item>
          </v-list>
          <v-btn block color="success" to="/scan">Open scanner</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { EventStage } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    eventStages() {
      return this.$store.state.eventStages.filter((stage: EventStage) =>
        this.$store.getters.hasCodeBeenScanned(stage.code)
      );
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
