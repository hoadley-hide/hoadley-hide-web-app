<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">The Adventure</v-card-title>

        <v-card-text>Where are we up to in Hoadley Hide?</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-text>
          <v-timeline align-top dense>
            <v-timeline-item
              color="yellow"
              fill-dot
              v-if="nextEventStage"
              :icon="nextStageIcon"
              icon-color="black"
            >
              <v-card tile flat>
                <v-row no-gutters>
                  <v-col cols="12">
                    <i>
                      The next part of the Adventure starts
                      {{ nextEventStage.startTime | duration }}
                    </i>
                  </v-col>
                </v-row>
              </v-card>
            </v-timeline-item>

            <v-timeline-item
              v-for="stage in eventStages"
              :key="stage.name"
              :icon="stage.icon"
              color="red darken-4"
              fill-dot
            >
              <v-card tile flat nuxt :to="stage.path">
                <v-row no-gutters>
                  <v-col cols="12">
                    <strong>{{ stage.name }}</strong>
                  </v-col>
                  <v-col offset="1" cols="11" v-if="stage.showTime">
                    <strong> {{ stage.startTime | datetime }} </strong>
                  </v-col>
                  <v-col offset="1" cols="11">
                    <div class="text-caption text-truncate font-italic">
                      {{ stage.description.text }}
                    </div>
                  </v-col>
                  <v-col
                    offset="1"
                    cols="11"
                    v-if="stage.instructions.length > 0"
                  >
                    <div class="orange--text">
                      {{ stage.instructions.length }}
                      {{
                        stage.instructions.length === 1
                          ? "instruction"
                          : "instructions"
                      }}
                      for you to read
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="py-0"><!-- Force the row reset --></v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/">Home</v-btn>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block color="success" to="/scan">Open scanner</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { EventStage } from "~/types";

export default {
  data() {
    return {
      nextStageIcons: [
        "mdi-crosshairs-question",
        "mdi-calendar-question",
        "mdi-help-network-outline",
        "mdi-map-marker-question-outline",
        "mdi-progress-question",
      ],
    };
  },
  computed: {
    eventStages(): EventStage[] {
      if (!this.$useUser()) {
        return [];
      }

      if (this.$auth(["eventStage:seeAll"])) {
        return this.$store.getters.eventStagesNewestFirst;
      }

      return this.$store.getters.scannedEventStages;
    },
    nextEventStage(): EventStage {
      return this.$store.getters.nextEventStage;
    },
    nextStageIcon() {
      return this.nextStageIcons[
        (this.nextStageIcons.length * Math.random()) | 0
      ];
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: null, label: "The Adventure" },
    ]);
  },
};
</script>
