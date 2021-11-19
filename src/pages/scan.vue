<template>
  <v-row>
    <v-col cols="12" sm="6">
      <qr-code-scan @valid-code="routeValidCode">
        <v-card-title class="text-h2">Scan QR code</v-card-title>
      </qr-code-scan>
    </v-col>
  </v-row>
</template>

<script lang="ts">
// https://gruhn.github.io/vue-qrcode-reader/
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  data() {
    return {};
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Scan" },
    ]);
  },
  methods: {
    async routeValidCode(validCode) {
      this.$router.push(validCode);
    },
  },
};
</script>
