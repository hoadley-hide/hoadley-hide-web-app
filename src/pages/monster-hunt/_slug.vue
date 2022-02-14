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
    <v-col cols="12" sm="6" v-show="canCollectClue">
      <v-btn block color="warning" @click="collectClue"> Collect Clue </v-btn>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/monster-hunt/monsters">
        Back to Monster list
      </v-btn>
    </v-col>
    <authorised :allow="['monsterHunt:canShare']">
      <v-col cols="12" sm="6">
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
    </authorised>
  </v-row>
</template>

<script lang="ts">
import { createAlert, setBreadcrumbs } from "~/common/helper-factories";
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
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/monster-hunt", label: "Monster Hunt" },
      { to: null, label: this.monsterHuntMonster.name },
    ]);
  },
  methods: {
    collectClue() {
      this.$store.dispatch("collectClue", this.monsterHuntMonster);
      createAlert(this.$store, {
        message: "Clue added to your app",
        type: "success",
      });
      this.$router.push("/monster-hunt/clues");
    },
  },
};
</script>
