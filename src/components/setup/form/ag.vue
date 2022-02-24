<template>
  <v-row>
    <v-col cols="12">
      <v-stepper v-model="currentStep">
        <!-- Header items -->
        <v-stepper-header>
          <template v-for="(step, index) in availableSteps">
            <v-stepper-step
              :key="`${index}-step`"
              :complete="currentStep > index + 1"
              :step="index + 1"
              :editable="currentStep === index"
            >
              {{ step.title }}
            </v-stepper-step>

            <v-divider
              v-if="index !== availableSteps.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-stepper-header>

        <!-- Content items -->
        <v-stepper-items>
          <!-- Step 1 -->
          <setup-step-start
            entity="Anything Goes Player"
            :available-steps="availableSteps"
            @next-step="nextStep(1)"
          ></setup-step-start>

          <!-- Step 2 -->
          <setup-step-monster-hunt
            @next-step="nextStep(2)"
            @monster-hunt-player-data="handleMonsterHuntPlayer"
          ></setup-step-monster-hunt>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { MonsterHuntPlayer } from "~/types/index";

export default {
  data() {
    return {
      currentStep: 1,
      availableSteps: [
        {
          icon: "mdi-check",
          title: "Start",
          label: "Welcome to Anything Goes",
        },
        {
          icon: "mdi-ghost",
          title: "Enter your Details",
          label: "Ready to find some monsters?",
        },
      ],
    };
  },
  mounted() {},
  watch: {
    steps(val) {
      if (this.currentStep > val) {
        this.currentStep = val;
      }
    },
  },
  methods: {
    nextStep(index) {
      if (index === this.availableSteps.length) {
        this.$emit("complete", null);
      } else {
        this.currentStep = index + 1;
      }
    },
    async handleMonsterHuntPlayer(playerData: MonsterHuntPlayer) {
      this.$store.dispatch("persistUser", playerData);
    },
  },
};
</script>
