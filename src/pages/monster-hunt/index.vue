<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title class="text-h2">Monster Hunt at AG</v-card-title>

          <v-card-text>Identified Monsters for Hoadley Hide</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <btn-block :btnBlocks="btnBlocks"></btn-block>
    <v-row>
      <v-col cols="12">
        <v-btn block color="success" to="/scan">Open scanner</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { authorised } from "~/common/authorisation";
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  computed: {
    btnBlocks() {
      return [
        {
          title: "Identified Monsters",
          subtitle: this.remainingMonsters
            ? `${this.remainingMonsters} left to find`
            : "",
          to: "/monster-hunt/monsters",
          colour: "purple",
        },
        {
          title: "Discovered Clues",
          subtitle: this.cluesIssued ? `${this.cluesIssued} found` : "",
          to: "/monster-hunt/clues",
          colour: "orange",
        },
      ];
    },
    remainingMonsters(): number | null {
      if (!authorised(this.$store, ["authenticated"])) {
        return null;
      }

      return this.$store.getters.remainingMonsters.length;
    },
    remainingClues(): number | null {
      if (!authorised(this.$store, ["authenticated"])) {
        return null;
      }

      return this.$store.getters.remainingClues.length;
    },
    cluesIssued(): number | null {
      if (!authorised(this.$store, ["authenticated"])) {
        return null;
      }

      return this.$store.getters.monsterHuntCluesIssued.length;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Monster Hunt" },
    ]);
  },
};
</script>
