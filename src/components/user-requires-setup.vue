<template>
  <div>
    <client-only>
      <v-container v-if="userSetupRequired">
        <v-row>
          <v-col class="pb-0 text-center">
            <v-card>
              <v-card-text class="text-body-1 font-weight-black success--text">
                Hello Traveller!
              </v-card-text>
              <v-card-text class="text-body-2">
                Welcome to our humble village. In a moment we will show you
                around, but first, who are you?
              </v-card-text>
              <v-divider></v-divider>

              <v-container>
                <btn-block :btnBlocks="signUpActions"></btn-block>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </client-only>
  </div>
</template>

<script lang="ts">
import { EventStage, EventStageSignUpAction } from "~/types";
import btnBlock from "./btn-block.vue";
export default {
  components: { btnBlock },
  computed: {
    activeEventStage(): EventStage | null {
      return this.$store.getters.activeEventStage;
    },
    signUpActions(): EventStageSignUpAction[] {
      return this.activeEventStage?.stageActions?.signUpActions ?? [];
    },

    userSetupRequired() {
      const isPageSetup = [
        "/user/admin/setup",
        "/user/ag/setup",
        "/user/patrol/setup",
        "/user/stunt/setup",
      ].includes(this.$route.path);
      if (isPageSetup) {
        return false;
      }

      if (this.$store.getters.user) {
        return false;
      }

      return true;
    },
  },
};
</script>
