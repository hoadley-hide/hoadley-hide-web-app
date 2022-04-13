<template>
  <v-row>
    <v-col cols="12" sm="6">
      <qr-code-scan @valid-code="routeValidCode">
        <v-card-title class="text-h2">Scan QR code</v-card-title>
      </qr-code-scan>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/">Home</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
// https://gruhn.github.io/vue-qrcode-reader/
import { Entity } from "~/types";

export default {
  data() {
    return {};
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: null, label: "Scan" },
    ]);
  },
  methods: {
    async routeValidCode(validEntity: Entity) {
      switch (validEntity._type) {
        case "eventStage":
          return this.$router.push(validEntity.path);
        case "stunt":
          return this.$router.push(validEntity.path);
        case "monsterHuntMonster":
          return this.$router.push(validEntity.path);
        case "patrol":
          return this.$router.push(validEntity.path);
        case "walkpoint":
          return this.$router.push(validEntity.path);
      }
    },
  },
};
</script>
