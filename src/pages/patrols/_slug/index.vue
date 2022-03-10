<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ patrol.name }}</v-card-title>

        <v-card-text>Patrol Number: #{{ patrol.patrolNumber }}</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" v-show="$auth(['patrol:canCheckIn'])">
      <v-btn block nuxt :to="`${patrol.path}/checkin`"> Check in Patrol </v-btn>
    </v-col>
    <v-col
      cols="12"
      sm="6"
      v-show="$useUser() && patrol.code === $useUser().code"
    >
      <v-card>
        <v-card-text>
          <strong>This is your Patrol.</strong> You can share this QR code with
          friends from other patrols!
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
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
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { AppUserEntity } from "~/types";

export default {
  validate({ params, store }) {
    return store.getters.patrol(params.slug);
  },
  data() {
    return {};
  },
  computed: {
    patrol() {
      return this.$store.getters.patrol(this.$route.params.slug);
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/patrols", label: "Patrols" },
      { to: null, label: this.patrol.name },
    ]);
  },
};
</script>
