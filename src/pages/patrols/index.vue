<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Patrols</v-card-title>

        <v-card-text>Browse the patrols you have met so far.</v-card-text>
      </v-card>

      <stats-patrols-met class="mt-4"></stats-patrols-met>
    </v-col>
    <v-col cols="12" sm="6" v-show="$useUser((u) => u._type === 'patrol')">
      <v-card color="indigo">
        <v-card-text>
          <p class="text-h5">Hanging together with the gang.</p>
          <v-btn block outlined nuxt :to="$useUser((u) => u.path, '')">
            View your Patrol
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" v-if="inflightCheckpoints.length !== 0">
      <v-card>
        <v-card-title class="text-h4">In Progress Check Ins</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="checkpoint in inflightCheckpoints"
              :key="checkpoint.id"
              :to="`${checkpoint.patrol.path}/checkin`"
            >
              <v-list-item-content>
                <chip-patrol :patrol="checkpoint.patrol"></chip-patrol>
                <chip-stunt
                  :stunt="checkpoint.recording"
                  v-if="checkpoint.recording._type === 'stunt'"
                ></chip-stunt>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <client-only>
            <v-list>
              <v-list-item
                v-for="patrol in patrols"
                :key="patrol.title"
                :to="`/patrols/${patrol.slug}`"
              >
                <v-list-item-content>
                  <chip-patrol :patrol="patrol"></chip-patrol>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="patrols.length === 0">
                <i>You have not discovered any patrols</i>
              </v-list-item>
            </v-list>
          </client-only>
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
import { Patrol } from "~/types";
import { names as patrol } from "~/store/patrol";

export default {
  data() {
    return {};
  },
  computed: {
    patrols(): Patrol[] {
      return this.$store.getters[patrol.getters.getPatrols];
    },
    inflightCheckpoints() {
      return this.$store.getters["checkpoint/getPartials"](this.$useUser());
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: null, label: "Patrols" },
    ]);
    this.$store.dispatch("fetchMyEventLogs", { syncMode: "diff" });
  },
};
</script>
