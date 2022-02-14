<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">Identified Monsters</v-card-title>

        <v-card-text>Browse the monsters you have identified.</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <client-only>
            <v-list>
              <v-list-item
                v-for="monsterHuntMonster in monsterHuntMonsters"
                :key="monsterHuntMonster.name"
                :to="`/monster-hunt/${monsterHuntMonster.slug}`"
              >
                <v-icon left>{{ monsterHuntMonster.icon }}</v-icon>
                <span class="tab-title-left-align">
                  {{ monsterHuntMonster.name }}
                </span>
              </v-list-item>
              <v-list-item v-if="monsterHuntMonsters.length === 0">
                <i>You have not discovered any Monsters</i>
              </v-list-item>
            </v-list>
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-btn block color="success" to="/scan">Open scanner</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { authorised } from "~/common/authorisation";
import { setBreadcrumbs } from "~/common/helper-factories";
import { MonsterHuntMonster } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    monsterHuntMonsters(): MonsterHuntMonster[] {
      if (!authorised(this.$store, ["authenticated"])) {
        return [];
      }

      if (authorised(this.$store, ["monsterHunt:seeAll"])) {
        return this.$store.state.monsterHuntMonsters;
      }

      return this.$store.state.monsterHuntMonsters.filter(
        (monsterHuntMonster: MonsterHuntMonster) =>
          this.$store.getters.hasCodeBeenScanned(monsterHuntMonster.code)
      );
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/monster-hunt", label: "Monster Hunt" },
      { to: null, label: "Monsters" },
    ]);
  },
};
</script>
