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
            entity="Anything Goes User"
            :available-steps="availableSteps"
            @next-step="nextStep(1)"
          ></setup-step-start>

          <!-- Step 2 -->
          <setup-step-monstemon-go
            @next-step="nextStep(2)"
            @monstemon-go-player-data="handleMonstemonGoPlayer"
          ></setup-step-monstemon-go>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { Admin } from "~/types/index";

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
          title: "Find Monsters",
          label: "Scan the QR Code of monsters to identify them",
        },
      ],
      adminId: null,
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "User" },
      { to: null, label: "Anything Goes Setup" },
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
    admin() {
      if (!this.adminId) {
        return null;
      }
      return this.$store.getters.admin(this.adminId);
    },
  },
  methods: {
    nextStep(index) {
      if (index === this.availableSteps.length) {
        this.$router.push(`/`);
      } else {
        this.currentStep = index + 1;
      }
    },
    async handleMonstemonGoPlayer(adminData: Admin) {
      this.adminId = adminData.code;
      this.$store.dispatch("persistUser", { adminId: this.adminId });
    },
  },
};
</script>
