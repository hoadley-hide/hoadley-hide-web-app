<template>
  <v-row>
    <v-col cols="12">
      <v-stepper v-model="currentStep">
        <!-- Header items -->
        <v-stepper-header>
          <template v-for="(step, index) in availableSteps">
            <v-stepper-step
              :key="`${index}-step`"
              :complete="currentStep > index"
              :step="index + 1"
              :editable="currentStep > index"
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
          <v-stepper-content step="1">
            <v-card>
              <v-card-title class="text-h4">
                Setting up your Patrol
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="action in availableSteps"
                    :key="action.label"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ action.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      {{ action.label }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <v-btn class="mt-6" color="primary" @click="nextStep(1)">
              Get Started
            </v-btn>
          </v-stepper-content>

          <!-- Step 2 -->
          <v-stepper-content step="2">
            <qr-code-scan v-if="currentStep === 2" @valid-code="routeValidCode">
              <v-card-title class="text-h4">
                Scan your patrol's QR Code
              </v-card-title>
            </qr-code-scan>

            <v-btn class="mt-6" color="primary" @click="nextStep(2)">
              Continue
            </v-btn>
          </v-stepper-content>

          <!-- Step 3 -->
          <v-stepper-content step="3">
            <v-card>
              <v-card-title class="text-h4">
                Confim all of you're Patrol is here!
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="action in patrolMembers"
                    :key="action.label"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ action.fullname }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ action.formation }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <v-btn color="primary" @click="nextStep(3)">Okie!</v-btn>
          </v-stepper-content>

          <!-- Step 4 -->
          <v-stepper-content step="4">
            <v-card class="mb-12" tile>
              <v-card-title class="text-h4">
                Take a photo of your Patrol!
              </v-card-title>
              <v-card-text> Photz plz </v-card-text>
            </v-card>

            <v-btn color="primary" @click="nextStep(4)">Got them!</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

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
          label: "Take a photo of you're patrol!",
        },
      ],
      patrolMembers: [
        {
          fullname: "Dirk Arends",
          formation: "Keith Farquhar Rovers",
        },
        {
          fullname: "Cheese Anderson",
          formation: "Victorian Venturer Council",
        },
        {
          fullname: "Paige Baddeley",
          formation: "Leichhardt Rovers",
        },
        {
          fullname: "Charlie O'Neil",
          formation: "Venturers",
        },
        {
          fullname: "Lucy",
          formation: "Venturers",
        },
        {
          fullname: "Jessy Lang",
          formation: "Boss Hurst Rovers",
        },
      ],
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

  methods: {
    nextStep(index) {
      if (index === this.availableSteps.length) {
        this.currentStep = 1;
      } else {
        this.currentStep = index + 1;
      }
    },
  },
};
</script>
