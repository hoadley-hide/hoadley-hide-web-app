<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Patrols</v-card-title>

        <v-card-text>Browse the patrols locations and teams.</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="patrol in patrols"
              :key="patrol.title"
              :to="`/patrols/${patrol.slug}`"
            >
              <v-icon left>{{ patrol.icon }}</v-icon>
              <span class="tab-title-left-align">{{ patrol.name }}</span>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { AppUserEntity, Patrol } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    patrols() {
      if (!this.activeUser) {
        return [];
      }
      if (this.activeUser._type === "patrol") {
        return this.$store.state.patrols.filter((patrol: Patrol) =>
          this.$store.getters.hasCodeBeenScanned(patrol.code)
        );
      } else if (this.activeUser._type === "stunt") {
        return this.$store.state.patrols;
      } else if (this.activeUser._type === "admin") {
        return this.$store.state.patrols;
      }
    },
    activeUser(): AppUserEntity | null {
      return this.$store.getters.user;
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

<style scoped>
.tab-title-left-align {
  width: 100%;
  text-align: left;
}
</style>
