<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Stunts</v-card-title>

        <v-card-text>Browse the stunts locations and teams.</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="stunt in stunts"
              :key="stunt.title"
              :to="`/stunts/${stunt.slug}`"
            >
              <v-icon left>{{ stunt.icon }}</v-icon>
              <span class="tab-title-left-align">{{ stunt.name }}</span>
            </v-list-item>
            <v-list-item v-if="stunts.length === 0">
              <i>You have not discovered any stunts</i>
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
import { AppUserEntity, Stunt } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    stunts() {
      if (!this.activeUser) {
        return [];
      }
      if (this.activeUser._type === "patrol") {
        return this.$store.state.stunts.filter((stunt: Stunt) =>
          this.$store.getters.hasCodeBeenScanned(stunt.code)
        );
      } else if (this.activeUser._type === "stunt") {
        return this.$store.state.stunts;
      } else if (this.activeUser._type === "admin") {
        console.log(this.$store.state.stunts);
        return this.$store.state.stunts;
      }
    },
    activeUser(): AppUserEntity | null {
      return this.$store.getters.user;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Stunts" },
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
