<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Stunts</v-card-title>

        <v-card-text>Browse the stunts locations and teams.</v-card-text>

        <v-card-text><event-day-selector></event-day-selector></v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <stunt-map></stunt-map>
    </v-col>
    <v-col cols="12" sm="6">
      <stats-stunts-visited></stats-stunts-visited>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-list>
            <client-only>
              <v-list-item
                v-for="stunt in stunts"
                :key="stunt.title"
                :to="`/stunts/${stunt.slug}`"
              >
                <v-list-item-icon>
                  <v-icon>{{ stunt.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <chip-stunt :stunt="stunt"></chip-stunt>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="stunts.length === 0">
                <i>You have not discovered any stunts</i>
              </v-list-item>
            </client-only>
          </v-list>
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
import { Stunt } from "~/types";
import { names as stunt } from "~/store/stunt";

export default {
  data() {
    return {};
  },
  computed: {
    stunts(): Stunt[] {
      return this.$store.getters[stunt.getters.getStunts];
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: null, label: "Stunts" },
    ]);
  },
};
</script>
