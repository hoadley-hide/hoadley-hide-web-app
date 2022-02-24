<template>
  <v-stepper-content step="2">
    <v-card class="mb-12" tile>
      <v-card-title class="text-h4">Your Details</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="What's your name?"
          :rules="[rules.required]"
          @keyup.enter="handleSubmit"
        ></v-text-field>
      </v-card-text>
    </v-card>

    <v-btn block color="primary" @click="handleSubmit">
      Start finding Monsters!
    </v-btn>
  </v-stepper-content>
</template>

<script lang="ts">
import { MonsterHuntPlayer } from "~/types";

import uuid4 from "uuid4";

export default {
  data() {
    return {
      name: "",
      rego: "",
      rules: {
        required: (value) => !!value || "Required.",
      },
    };
  },
  methods: {
    handleSubmit() {
      const data: MonsterHuntPlayer = {
        _type: "monsterHuntPlayer",
        id: uuid4(),
        name: this.name,
        rego: this.rego,
        timeStarted: new Date(),
      };

      this.$emit("monster-hunt-player-data", data);
      this.$emit("next-step");
    },
  },
};
</script>
