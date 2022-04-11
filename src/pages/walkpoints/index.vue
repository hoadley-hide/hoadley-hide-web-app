<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Walkpoints</v-card-title>

        <v-card-text><event-day-selector></event-day-selector></v-card-text>
      </v-card>

      <stats-walkpoints-visited class="mt-4"></stats-walkpoints-visited>
    </v-col>
    <v-col cols="12" sm="6">
      <stunt-map></stunt-map>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-list>
            <client-only>
              <v-list-item
                v-for="walkpoint in walkpoints"
                :key="walkpoint.title"
                :to="`/walkpoints/${walkpoint.slug}`"
              >
                <v-list-item-icon>
                  <v-icon>{{ walkpoint.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <chip-walkpoint :walkpoint="walkpoint"></chip-walkpoint>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="walkpoints.length === 0">
                <i>You have not discovered any walkpoints</i>
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
import { Walkpoint } from "~/types";
import { names as walkpoint } from "~/store/walkpoint";

export default {
  data() {
    return {};
  },
  computed: {
    walkpoints(): Walkpoint[] {
      return this.$store.getters[walkpoint.getters.getWalkpoints];
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: null, label: "Walkpoints" },
    ]);
  },
};
</script>
