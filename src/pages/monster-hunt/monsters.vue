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
                v-for="data in monsterHuntMonsters"
                :key="data.monster.name"
                :to="`/monster-hunt/${data.monster.slug}`"
              >
                <v-list-item-content>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="body-1">
                        {{ data.monster.name }}
                      </div>
                      <div>
                        <span class="text--secondary">Time:</span>
                        <code>{{ data.scanned.time | datetime }}</code>
                      </div>
                    </div>
                    <v-chip>
                      {{ data.scanned.ago }}
                    </v-chip>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="monsterHuntMonsters.length === 0">
                <i>You have not discovered any Monsters</i>
              </v-list-item>
            </v-list>
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/monster-hunt"> Back to Monster Hunt </v-btn>
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

      return this.$store.state.monsterHuntMonsters
        .map((monster: MonsterHuntMonster) => {
          const scanned = this.$store.getters.hasCodeBeenScanned(monster.code);
          return {
            monster: monster,
            scanned: {
              time: new Date(scanned.time),
              ago: this.$options.filters?.duration(new Date(scanned.time)),
            },
          };
        })
        .filter((monsterHuntMonsterData) => monsterHuntMonsterData.scanned);
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
