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
            entity="admin"
            :available-steps="availableSteps"
            @next-step="nextStep(1)"
          ></setup-step-start>

          <!-- Step 2 -->
          <setup-step-scan-qr-code
            entity="admin"
            :step-active="currentStep === 2"
            @next-step="nextStep(2)"
            @admin-data="handleAdmin"
          ></setup-step-scan-qr-code>
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
          label: "Welcome to Hoadley Hide",
        },
        {
          icon: "mdi-qrcode",
          title: "Scan QR Code",
          label: "Scan your admin's QR Code",
        },
      ],
      adminId: null,
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/user", label: "User" },
      { to: "/user/admin", label: "Admin" },
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
    async handleAdmin(adminData: Admin) {
      this.adminId = adminData.code;
      this.$store.dispatch("persistUser", { adminId: this.adminId });
    },
  },
};
</script>
