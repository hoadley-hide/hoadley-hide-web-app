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
            step="3"
            @next-step="nextStep(3)"
          ></setup-step-upload-photos>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Stunt, Entity } from "~/types/index";
import { names as stunt } from "~/store/stunt";

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
    stunt(): Stunt | null {
      if (!this.stuntId) {
        return null;
      }

      return this.$store.getters[stunt.getters.getStunt](this.stuntId);
    },
  },
  methods: {
    async handleQueryCode() {
      const code = this.$route.query.code ?? null;
      if (!code) {
        return;
      }

      const entity: Entity = await this.$store.dispatch("validateCode", code);

      if (entity && entity._type === "stunt") {
        this.handleStunt(entity);
      }
    },
    nextStep(index) {
      if (index === 1 && this.stuntId !== null) {
        // Stunt is preloaded, dont ask again
        this.currentStep = index + 2;
        return;
      }

      if (index === this.availableSteps.length) {
        this.$store.dispatch("persistUser", this.stunt);
        this.$emit("complete", this.stunt?.code);
      } else {
        this.currentStep = index + 1;
      }
    },
    async handleStunt(stuntData: Stunt) {
      this.stuntId = stuntData.id;
    },
  },
};
</script>
