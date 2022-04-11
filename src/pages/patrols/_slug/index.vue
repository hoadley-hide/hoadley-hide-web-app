<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ patrol.name }}</v-card-title>

        <v-card-text>Patrol Number: #{{ patrol.patrolNumber }}</v-card-text>
      </v-card>
    </v-col>

    <!-- Check in patrol: Stunt -->
    <v-col cols="12" sm="6" v-if="$auth(['patrol:canCheckpoint:stunt:visit'])">
      <checkpoint-stunt-visit :patrol="patrol"></checkpoint-stunt-visit>
    </v-col>

    <!-- Check in patrol: VOC -->
    <v-col cols="12" sm="6" v-if="$auth(['patrol:canCheckpoint:voc'])">
      <checkpoint-voc :patrol="patrol"></checkpoint-voc>
    </v-col>

    <!-- Your patrol (tm) -->
    <v-col cols="12" sm="6" v-if="$useUser((u) => u.code === patrol.code)">
      <v-card>
        <v-card-text>
          <strong>This is your Patrol.</strong> You can share this QR code with
          friends from other patrols!
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Patrol Members -->
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h4">Patrol Members</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="member in patrol.members" :key="member.label">
              <v-list-item-content>
                <span>{{ member.fullname }} ({{ member.formation }})</span>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Share patrol -->
    <v-col cols="12" sm="6" v-if="$auth(['patrol:canShare'])">
      <v-card>
        <v-card-title class="text-h4 d-flex flex-nowrap">
          <v-icon left large>mdi-qrcode</v-icon>
          <span>Share this patrol</span>
        </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <qr-code
            :entity="{
              code: patrol.code,
              path: patrol.path,
              name: patrol.name,
            }"
          ></qr-code>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="py-0"><!-- Force the row reset --></v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/patrols">Back to Patrols</v-btn>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block color="success" to="/scan">Open scanner</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { names as patrol } from "~/store/patrol";

export default {
  validate({ params, store }) {
    return store.getters[patrol.getters.getPatrol](params.slug);
  },
  data() {
    return {};
  },
  computed: {
    patrol() {
      return this.$store.getters[patrol.getters.getPatrol](
        this.$route.params.slug
      );
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/patrols", label: "Patrols" },
      { to: null, label: this.patrol.name },
    ]);
    this.$store.dispatch("fetchMyEventLogs", { syncMode: "diff" });
  },
};
</script>
