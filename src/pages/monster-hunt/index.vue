<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6">
        <v-card :color="remainingMonsters === 0 ? 'green' : ''">
          <v-card-title class="text-h2">Monster Hunt at AG</v-card-title>

          <v-card-text v-show="remainingMonsters !== 0">
            With you're monster hunting expirence, you should be able to fine
            and identify these Monsters in no time!
            <br />
            <strong>Remember:</strong> You only have till 3pm on Saturday
          </v-card-text>
          <v-card-text v-show="remainingMonsters === 0">
            <span class="text-body-1 text-center"> Wow! I'm impressed! </span>
            <br />
            <br />
            You've found all the monsters hiding around the Anything Goes
            campsite!
            <br />
            We have a little reward so head over to the Hoadley Hide tent before
            3pm to pick it up
          </v-card-text>
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
          colour: this.remainingMonsters > 0 ? "purple" : "green",
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
