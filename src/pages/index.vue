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
        v-html="activeEventStage.description"
      ></v-card-text>
      <v-card-text v-else>
        <p>Today, you arrive at our humble village. Let me show you around.</p>
      </v-card-text>

      <v-card-text>
        <v-list>
          <v-list-item
            v-for="item in links"
            :key="item.title"
            link
            nuxt
            :to="item.to"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { EventStage } from "~/types";

export default {
  data() {
    return {
      drawer: false,
      links: [
        {
          title: "Monsters At AG",
          subtitle: "See the monsters you have identified",
          icon: "mdi-ghost",
          to: "/monstemon-go",
        },
        {
          title: "Stunts",
          subtitle: "See the stunts you've visited",
          icon: "mdi-map-clock",
          to: "/stunts",
        },
        {
          title: "The Adventure",
          subtitle: "What comes next?",
          icon: "mdi-shield-sword",
          to: "/event",
        },
        {
          title: "First Aid",
          subtitle: "My feet are hurting...",
          icon: "mdi-medical-bag",
          to: "/first-aid",
        },
        { title: "Wiki", icon: "mdi-information", to: "/wiki" },
      ],
    };
  },
  computed: {
    activeEventStage(): EventStage | null {
      const activeStages = this.$store.state.eventStages
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
          return Date.parse(a.startTime) - Date.parse(b.startTime);
        });
      return activeStages[activeStages.length - 1];
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [{ to: null, label: "Home" }]);
  },
};
</script>
