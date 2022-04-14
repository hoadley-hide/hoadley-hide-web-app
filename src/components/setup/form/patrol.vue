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
            entity="patrol"
            :available-steps="availableSteps"
            @next-step="nextStep(1)"
          ></setup-step-start>

          <!-- Step 2 -->
          <setup-step-scan-qr-code
            entity="patrol"
            :step-active="currentStep === 2"
            @next-step="nextStep(2)"
            @patrol-data="handlePatrol"
          ></setup-step-scan-qr-code>

          <!-- Step 3 -->
          <setup-step-patrol-members
            :patrol="patrol"
            @next-step="nextStep(3)"
          ></setup-step-patrol-members>

          <!-- Step 4 -->
          <setup-step-upload-photos
            step="4"
            entity="patrol"
            @next-step="nextStep(4)"
          ></setup-step-upload-photos>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Patrol, Entity } from "~/types/index";
import { names as patrol } from "~/store/patrol";

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
  async mounted() {
    await this.handleQueryCode();
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
      return this.$store.getters[patrol.getters.getPatrol](this.patrolId);
    },
  },
  methods: {
    async handleQueryCode() {
      const code = this.$route.query.code ?? null;
      if (!code) {
        return;
      }

      const entity: Entity = await this.$store.dispatch("validateCode", code);

      if (entity && entity._type === "patrol") {
        this.handlePatrol(entity);
      }
    },
    nextStep(index) {
      if (index === 1 && this.patrolId !== null) {
        // Patrol is preloaded, dont ask again
        this.currentStep = index + 2;
        return;
      }

      if (index === this.availableSteps.length) {
        this.$store.dispatch("persistUser", this.patrol);
        this.$emit("complete", this.patrol.code);
      } else {
        this.currentStep = index + 1;
      }
    },
    async handlePatrol(patrolData: Patrol) {
      this.patrolId = patrolData.id;
    },
  },
};
</script>
