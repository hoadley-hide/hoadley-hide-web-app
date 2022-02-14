<template>
  <v-stepper-content step="2">
    <v-card class="mb-12" tile>
      <v-card-title class="text-h4">
        Find Mosters at Anything Goes!
      </v-card-title>
      <v-card-text>
        Scan your QR Code of monsters to identify them
      </v-card-text>
    </v-card>

    <v-card class="mb-12" tile>
      <v-card-text>
        <v-text-field
          v-model="name"
          label="What's your name?"
          :rules="[rules.required]"
        ></v-text-field>
      </v-card-text>
    </v-card>

    <v-card class="mb-12" tile>
      <v-card-text>
        <v-text-field
          v-model="rego"
          label="What's your Scout Membership number?"
          :rules="[rules.required]"
        ></v-text-field>
      </v-card-text>
    </v-card>

    <v-btn block color="primary" @click="$emit('next-step')">
      Start finding Monsters!
    </v-btn>
  </v-stepper-content>
</template>

<script lang="ts">
import { MonstemonGoPlayer } from "~/types";
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
      const data: MonstemonGoPlayer = {
        name: this.name,
        rego: this.rego,
      };
      this.$emit("monstemon-go-player-data", data);
      this.$emit("next-step");
    },
  },
};
</script>
