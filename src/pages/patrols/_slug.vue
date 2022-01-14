<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ patrol.name }}</v-card-title>

        <v-card-text>Number: {{ patrol.patrolNumber }}</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h4 d-flex flex-nowrap">
          <v-icon left large>mdi-qrcode</v-icon>
          <span>Share this patrol</span>
        </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <qr-code :url="qrCodeUrl"></qr-code>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

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
    qrCodeUrl() {
      return `https://hoadley-hide.netlify.app/scan?code=${this.patrol.shortId}`;
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
