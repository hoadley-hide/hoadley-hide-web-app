<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Monstemon Go</v-card-title>

        <v-card-text>Browse the monsters you have identified.</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="monstemonGo in monstemonGos"
              :key="monstemonGo.title"
              :to="`/monstemon-go/${monstemonGo.slug}`"
            >
              <v-icon left>{{ monstemonGo.icon }}</v-icon>
              <span class="tab-title-left-align">{{ monstemonGo.name }}</span>
            </v-list-item>
            <v-list-item v-if="monstemonGos.length === 0">
              <i>You have not discovered any Monstemon Gos</i>
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
import { AppUserEntity, MonstemonGo } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    monstemonGos() {
      if (!this.activeUser) {
        return [];
      }
      if (this.activeUser._type === "patrol") {
        return this.$store.state.monstemonGos.filter(
          (monstemonGo: MonstemonGo) =>
            this.$store.getters.hasCodeBeenScanned(monstemonGo.code)
        );
      } else if (this.activeUser._type === "stunt") {
        return this.$store.state.monstemonGos;
      } else if (this.activeUser._type === "admin") {
        return this.$store.state.monstemonGos;
      }
    },
    activeUser(): AppUserEntity | null {
      return this.$store.getters.user;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Monstemon Go" },
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
