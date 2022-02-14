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
            entity="stunt"
            :available-steps="availableSteps"
            @next-step="nextStep(1)"
          ></setup-step-start>

          <!-- Step 2 -->
          <setup-step-scan-qr-code
            entity="stunt"
            :step-active="currentStep === 2"
            @next-step="nextStep(2)"
            @stunt-data="handleStunt"
          ></setup-step-scan-qr-code>

          <!-- Step 3 -->
          <setup-step-upload-photos
            entity="stunt"
            @next-step="nextStep(3)"
          ></setup-step-upload-photos>
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
          label: "Scan your stunts's QR Code",
        },
        {
          icon: "mdi-camera",
          title: "Take a photo",
          label: "Take a photo of your stunt team!",
        },
      ],
      stuntId: null,
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "User" },
      { to: null, label: "Stunt Setup" },
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
    stunt() {
      if (!this.stuntId) {
        return null;
      }
      return this.$store.getters.stunt(this.stuntId);
    },
  },
  methods: {
    nextStep(index) {
      if (index === this.availableSteps.length) {
        this.$router.push(`/stunts/${this.stunt.slug}`);
      } else {
        this.currentStep = index + 1;
      }
    },
    async handleStunt(stuntData: Patrol) {
      this.stuntId = stuntData.code;
      this.$store.dispatch("persistUser", { stuntId: this.stuntId });
    },
  },
};
</script>
