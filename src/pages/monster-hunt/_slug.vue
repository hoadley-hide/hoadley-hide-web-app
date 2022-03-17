<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{
          monsterHuntMonster.name
        }}</v-card-title>

        <v-card-text v-html="monsterHuntMonster.description.html"></v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h4">Clue for this monster</v-card-title>
        <v-card-text>
          This is the clue which was for
          {{ monsterHuntMonster.name }} and likely lead you here.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text
          v-for="clue in monsterHuntMonster.clues"
          :key="clue.text"
          v-html="clue.html"
        ></v-card-text>
        <v-card-text v-if="monsterHuntMonster.clues.length === 0">
          No clues defined. Talk to HHMT
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" v-show="canCollectClue">
      <v-btn
        block
        :color="allCluesCollected ? 'purple' : 'warning'"
        @click="collectClue"
      >
        {{
          allCluesCollected
            ? "Confirm Monster Identification"
            : "Collect Next Clue"
        }}
      </v-btn>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/monster-hunt/monsters">
        Back to Monster list
      </v-btn>
    </v-col>
    <v-col cols="12" sm="6" v-show="$auth(['monsterHunt:canShare'])">
      <v-card>
        <v-card-title class="text-h4 d-flex flex-nowrap">
          <v-icon left large>mdi-qrcode</v-icon>
          <span>Share this stage</span>
        </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <qr-code
            :entity="{
              code: monsterHuntMonster.code,
              path: monsterHuntMonster.path,
              name: monsterHuntMonster.name,
            }"
          ></qr-code>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { MonsterHuntMonster } from "~/types";

export default {
  validate({ params, store }) {
    return store.getters.monsterHuntMonster(params.slug);
  },
  data() {
    return {};
  },
  computed: {
    monsterHuntMonster(): MonsterHuntMonster {
      return this.$store.getters.monsterHuntMonster(this.$route.params.slug);
    },
    canCollectClue(): boolean {
      return this.$store.getters.monsterHuntCanGiveClue(
        this.monsterHuntMonster
      );
    },
    allCluesCollected(): boolean {
      return this.$store.getters.remainingClues.length === 0;
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/monster-hunt", label: "Monster Hunt" },
      { to: null, label: this.monsterHuntMonster.name },
    ]);
  },
  methods: {
    async collectClue() {
      const success = await this.$store.dispatch(
        "collectClue",
        this.monsterHuntMonster
      );

      if (success) {
        await this.$createAlert({
          message: "Clue added to your app",
          type: "success",
        });
        this.$router.push("/monster-hunt/clues");
      } else {
        await this.$createAlert({
          message: "You have already found all the clues",
          type: "success",
        });
        this.$router.push("/monster-hunt");
      }
    },
  },
};
</script>
