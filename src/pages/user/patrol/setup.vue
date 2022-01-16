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
          <setup-patrol-step-1
            :available-steps="availableSteps"
            @next-step="nextStep(1)"
          ></setup-patrol-step-1>

          <!-- Step 2 -->
          <setup-patrol-step-2
            :step-active="currentStep === 2"
            @next-step="nextStep(2)"
            @patrol-data="handlePatrol"
          ></setup-patrol-step-2>

          <!-- Step 3 -->
          <setup-patrol-step-3
            :patrol="patrol"
            @next-step="nextStep(3)"
          ></setup-patrol-step-3>

          <!-- Step 4 -->
          <setup-patrol-step-4
            :patrol="patrol"
            @next-step="nextStep(4)"
          ></setup-patrol-step-4>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { Patrol } from "~/types/index";

export default {
  data() {
    return {
      currentStep: 1,
      availableSteps: [
        {
          icon: "mdi-check",
          title: "Start",
          label: "Welcome to Hoadley Hide",
        },
        {
          icon: "mdi-qrcode",
          title: "Scan QR Code",
          label: "Scan your patrol's QR Code",
        },
        {
          icon: "mdi-account-group",
          title: "Confirm patrol members",
          label: "Confirm all your patrol members are here",
        },
        {
          icon: "mdi-camera",
          title: "Take a photo",
          label: "Take a photo of your patrol!",
        },
      ],
      patrolId: null,
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/user", label: "User" },
      { to: "/user/patrol", label: "Patrol" },
      { to: null, label: "Setup" },
    ]);
  },
  watch: {
    steps(val) {
      if (this.currentStep > val) {
        this.currentStep = val;
      }
    },
  },
  computed: {
    patrol() {
      if (!this.patrolId) {
        return null;
      }
      return this.$store.getters.patrol(this.patrolId);
    },
  },
  methods: {
    nextStep(index) {
      if (index === this.availableSteps.length) {
        this.$router.push(`/patrols/${this.patrol.slug}`);
      } else {
        this.currentStep = index + 1;
      }
    },
    async handlePatrol(patrolData: Patrol) {
      this.patrolId = patrolData.code;
      this.$store.dispatch("persistUser", { patrolId: this.patrolId });
    },
  },
};
</script>
