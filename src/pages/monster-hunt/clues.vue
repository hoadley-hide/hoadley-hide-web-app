<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">Discovered Clues</v-card-title>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <client-only placeholder="Loading clues">
            <v-list>
              <v-list-group
                v-for="issuedMonster in issuedMonsters"
                :key="issuedMonster.monster.code"
                no-action
              >
                <template v-slot:activator>
                  <v-list-item-icon>
                    <v-icon :color="issuedMonster.scanned ? 'green' : 'red'">
                      mdi-motion-sensor
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="py-2">
                    {{
                      issuedMonster.scanned
                        ? issuedMonster.monster.name
                        : "...Unknown Monster"
                    }}
                  </v-list-item-title>
                </template>
                <v-list-item v-if="issuedMonster.scanned">
                  <v-list-item-content>
                    <strong class="green--text">
                      You've found
                      {{ issuedMonster.monster.name }}! No need to keep looking.
                    </strong>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-for="clue in issuedMonster.monster.clues"
                  v-bind:key="clue.text"
                >
                  <v-list-item-content>
                    <span v-html="clue.html"></span>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="issuedMonster.monster.clues.length === 0">
                  <v-list-item-content>
                    <i>
                      Oop.. You did not find any clues for
                      {{ issuedMonster.monster.name }}. Come see the Hoadley
                      Hide Team to fix you up.
                    </i>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>

              <v-list-item v-if="issuedMonsters.length === 0">
                <i>You have not been left any clues</i>
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
import { MonsterHuntMonsterIssued } from "~/types";

export default {
  data() {
    return {};
  },
  computed: {
    issuedMonsters(): MonsterHuntMonsterIssued[] {
      if (!this.$useUser()) {
        return [];
      }

      return this.$store.getters.monsterHuntCluesIssued;
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/monster-hunt", label: "Monster Hunt" },
      { to: null, label: "Clues" },
    ]);
  },
};
</script>
