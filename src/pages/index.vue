<template>
  <div>
    <v-card>
      <v-card-title
        class="
          text-h2 text-center text-sm-left
          d-flex
          justify-space-around justify-sm-start
        "
      >
        M.O.N.S.T.E.R Hunters Guild
      </v-card-title>
      <v-card-subtitle class="text-subtitle-1 font-italic">
        What's the worst that could happen?
      </v-card-subtitle>

      <v-card-text
        v-if="activeEventStage"
        v-html="activeEventStage.description.html"
      ></v-card-text>
      <v-card-text v-else>
        <p>Today, you arrive at our humble village. Let me show you around.</p>
      </v-card-text>

      <v-card-text>
        <v-list>
          <v-list-item
            v-for="action in dashboardActions"
            :key="action.title"
            link
            nuxt
            :to="action.to"
          >
            <v-list-item-icon>
              <v-icon v-if="action.icon">{{ action.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ action.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ action.subtitle }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { EventStage, EventStageDashboardAction } from "~/types";

export default {
  computed: {
    activeEventStage(): EventStage | null {
      return this.$store.getters.activeEventStage;
    },
    dashboardActions(): EventStageDashboardAction[] {
      return this.activeEventStage?.stageActions?.dashboardActions ?? [];
    },
  },
  mounted() {
    this.$setBreadcrumbs([{ to: null, label: "Home" }]);
  },
};
</script>
