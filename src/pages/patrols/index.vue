<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Patrols</v-card-title>

        <v-card-text>Browse the patrols you have met so far.</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" v-show="$useUser((u) => u._type === 'patrol')">
      <v-card>
        <v-card-text>
          <p>Hanging together with the gang.</p>
          <v-btn block nuxt :to="$useUser((u) => u.path, '')">
            View your Patrol
          </v-btn>
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
          <v-btn block color="success" to="/scan">Open scanner</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { Patrol } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    patrols(): Patrol[] {
      if (!this.$useUser()) {
        return [];
      }

      if (this.$auth(["patrol:seeAll"])) {
        return this.$store.state.patrols;
      }

      return this.$store.state.patrols.filter((patrol: Patrol) =>
        this.$store.getters.hasCodeBeenScanned(patrol.code)
      );
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Patrols" },
    ]);
  },
};
</script>
