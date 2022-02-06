<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">The Adventure</v-card-title>

        <v-card-text>Where are we up to in Hoadley Hide?</v-card-text>
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
              <i>You have not discovered any adventures</i>
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
import { AppUserEntity, EventStage } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    eventStages() {
      if (!this.activeUser) {
        return [];
      }
      if (this.activeUser._type === "patrol") {
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
      } else if (this.activeUser._type === "stunt") {
        return this.$store.state.eventStages;
      } else if (this.activeUser._type === "admin") {
        return this.$store.state.eventStages;
      }
    },
    activeUser(): AppUserEntity | null {
      return this.$store.getters.user;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "The Adventure" },
    ]);
  },
};
</script>
