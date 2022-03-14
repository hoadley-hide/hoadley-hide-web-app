<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-card>
          <v-card-text class="text-body-1 font-weight-black success--text">
            Hello Traveller!
          </v-card-text>
          <v-card-text class="text-body-2">
            Welcome to our humble village. In a moment we will show you around,
            but first, who are you?
          </v-card-text>
          <div v-show="preloadedCode">
            <v-divider></v-divider>
            <v-card-text>
              Scanned Code: <code>{{ preloadedCode }}</code>
            </v-card-text>
            <v-card-text>
              We're holding your scanned code until you complete registration
            </v-card-text>
          </div>
          <div v-show="setupType === null">
            <v-divider></v-divider>
            <client-only>
              <v-container>
                <btn-block
                  :btn-blocks="signUpActions"
                  @click-block="handleActionClick"
                ></btn-block>
              </v-container>
            </client-only>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="setupType !== null">
        <setup-form-admin
          v-if="setupType === 'admin'"
          @complete="(code) => handleComplete('admin', code)"
        ></setup-form-admin>
        <setup-form-ag
          v-if="setupType === 'ag'"
          @complete="(code) => handleComplete('ag', code)"
        ></setup-form-ag>
        <setup-form-patrol
          v-if="setupType === 'patrol'"
          @complete="(code) => handleComplete('patrol', code)"
        ></setup-form-patrol>
        <setup-form-stunt
          v-if="setupType === 'stunt'"
          @complete="(code) => handleComplete('stunt', code)"
        ></setup-form-stunt>

        <v-btn block text color="warning" @click="clearSetup">Restart</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { createAlert } from "~/common/helper-factories";
import { Entity, EventStage, EventStageSignUpAction } from "~/types";

export default {
  data() {
    return {
      preloadedCode: null,
      setupType: null,
      setupStep: null,
    };
  },
  computed: {
    activeEventStage(): EventStage | null {
      return this.$store.getters.activeEventStage;
    },
    signUpActions(): EventStageSignUpAction[] {
      return this.activeEventStage?.stageActions?.signUpActions ?? [];
    },
  },
  async mounted() {
    this.handleQueryProgress();
    await this.handleQueryCode();
  },
  watch: {
    setupType() {
      this.updateQuery();
    },
    setupStep() {
      this.updateQuery();
    },
  },
  methods: {
    clearSetup() {
      this.setupType = null;
      this.setupStep = null;
    },
    async handleQueryCode() {
      const code = this.$route.query.code ?? null;
      if (!code) {
        return;
      }

      const entity: Entity = await this.$store.dispatch("validateCode", code);

      if (entity) {
        this.$store.dispatch("recordCodeScan", entity);
        this.preloadedCode = entity.code;
      }
    },
    handleQueryProgress() {
      const progress = this.$route.query.progress ?? null;
      if (!progress) {
        return;
      }

      const progressSplit = progress.split("-");

      if (progressSplit.length === 2) {
        this.setupType = progressSplit[0];
        this.setupStep = progressSplit[1];
      }
    },
    handleActionClick(clickTarget: string) {
      if (!clickTarget) {
        createAlert(this.$store, {
          heading: `Invalid setup action`,
          message: "Contact HHMT for assistance",
        });
        return;
      }

      this.setupType = clickTarget;
      this.setupStep = 1;
    },

    updateQuery() {
      const newProgress =
        this.setupType && this.setupStep
          ? `${this.setupType}-${this.setupStep}`
          : undefined;

      if (newProgress === this.$route.query.progress) {
        return;
      }

      this.$router.replace({
        query: {
          ...this.$route.query,
          progress: newProgress,
        },
      });
    },

    handleComplete(type, code) {
      const entity: Entity | null = this.$store.getters.findByIdOrCode(
        this.preloadedCode ?? code
      );

      this.clearSetup();

      this.$router.push(entity?.path ?? "/");
    },
  },
};
</script>
