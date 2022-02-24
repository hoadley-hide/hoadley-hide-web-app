<template>
  <v-row>
    <authorised :allow="['patrol:canCheckIn']">
      <template v-slot:default>
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h3">{{ patrol.name }}</v-card-title>

            <v-card-subtitle class="text--secondary">
              Checkin this patrol
            </v-card-subtitle>
          </v-card>
        </v-col>

        <v-form>
          <!-- Questions -->
          <v-col cols="12">
            <v-time-picker
              v-model="checkin['checkinTime']"
              title="Check in Time"
            ></v-time-picker>
          </v-col>

          <v-col cols="12">
            <v-row tile>
              <v-col cols="12">
                <v-slider
                  v-model="checkin['planning']"
                  label="Score: Planning"
                  min="0"
                  max="10"
                  step="1"
                ></v-slider>
              </v-col>
              <v-col cols="12">
                <v-slider
                  v-model="checkin['teamwork']"
                  label="Score: Team work"
                  min="0"
                  max="10"
                  step="1"
                ></v-slider>
              </v-col>
              <v-col cols="12">
                <v-slider
                  v-model="checkin['leadership']"
                  label="Score: Leadership"
                  min="0"
                  max="10"
                  step="1"
                ></v-slider>
              </v-col>
              <v-col cols="12">
                <v-slider
                  v-model="checkin['creativity']"
                  label="Score: Creativity"
                  min="0"
                  max="10"
                  step="1"
                ></v-slider>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-time-picker
              v-model="checkin['checkoutTime']"
              title="Check out Time"
            ></v-time-picker>
          </v-col>

          <!-- Submit Checkin -->
          <v-col cols="12">
            <v-btn block color="success" @click="submitCheckin">
              Submit Checkin
            </v-btn>
          </v-col>
        </v-form>
      </template>
      <template v-slot:blocked>
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h3">{{ patrol.name }}</v-card-title>

            <v-card-subtitle>Check-in this patrol</v-card-subtitle>
            <v-card-text>
              Why sir, are you here? You are not a stunt user. Buzz off.
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </authorised>
  </v-row>
</template>

<script lang="ts">
import { createAlert, setBreadcrumbs } from "~/common/helper-factories";
import { AppUserEntity, EventLog } from "~/types";

import uuid4 from "uuid4";

export default {
  validate({ params, store }) {
    return store.getters.patrol(params.slug);
  },
  data() {
    return {
      checkin: {},
    };
  },
  computed: {
    patrol() {
      return this.$store.getters.patrol(this.$route.params.slug);
    },
    activeUser(): AppUserEntity | null {
      return this.$store.getters.user;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/patrols", label: "Patrols" },
      { to: this.patrol.path, label: this.patrol.name },
      { to: null, label: "Check In" },
    ]);
  },
  methods: {
    async submitCheckin() {
      if (!this.activeUser) {
        createAlert(this.$store, {
          message: "You are not logged in, you can not check in a patrol",
        });
      }
      if (!this.patrol) {
        createAlert(this.$store, {
          message: "An internal error occurred, you can not check in a patrol",
        });
      }

      const logData: EventLog = {
        deduplicationId: uuid4(),
        eventName: this.$config.eventName,
        type: "checkpoint:stunt:visit",
        recordingEntity: {
          _type: this.activeUser._type,
          id: this.activeUser.id,
        },
        referencedEntity: { _type: this.patrol._type, id: this.patrol.id },
        data: this.checkin,
      };

      await this.$store.dispatch("persistEventLog", logData);

      this.$router.push(this.patrol.path);
    },
  },
};
</script>
