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
              v-for="stage in eventStages"
              :key="stage.name"
              :to="`/event/${stage.slug}`"
              :icon="stage.icon"
              color="red darken-4"
              fill-dot
            >
              <v-row class="pt-1" no-gutters>
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
    return {};
  },
  computed: {
    eventStages() {
      if (!this.$useUser()) {
        return [];
      }

      if (this.$auth(["eventStage:seeAll"])) {
        return this.$store.state.eventStages;
      }

      return this.$store.state.eventStages
        .filter((stage: EventStage) => {
          const stageAlwaysShown =
            stage.autoShowAfterStartTime &&
            Date.parse(stage.startTime) < Date.now();

          const codeScanned = this.$store.getters.hasCodeBeenScanned(
            stage.code
          );

          return codeScanned || stageAlwaysShown;
        })
        .sort((a: EventStage, b: EventStage) => {
          return Date.parse(b.startTime) - Date.parse(a.startTime);
        });
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
