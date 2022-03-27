<template>
  <v-stepper-content step="2">
    <qr-code-scan v-if="stepActive" @valid-code="handleValidCode">
      <v-card-title class="text-h4">
        Scan your {{ entity }}'s QR Code
      </v-card-title>
    </qr-code-scan>
  </v-stepper-content>
</template>

<script lang="ts">
import { names as stunt } from "~/store/stunt";
import { names as patrol } from "~/store/patrol";

export default {
  props: ["entity", "stepActive"],
  methods: {
    async handleValidCode(scannedData) {
      switch (this.entity) {
        case "admin":
          return await this.lookupAdmin(scannedData);
        case "patrol":
          return await this.lookupPatrol(scannedData);
        case "stunt":
          return await this.lookupStunt(scannedData);
      }
    },
    async lookupAdmin(scannedData) {
      const admin = this.$store.getters.admin(scannedData.code);
      if (!admin) {
        console.log("not a valid admin");
        return;
      }

      this.$emit("admin-data", admin);
      this.$emit("next-step");
    },
    async lookupPatrol(scannedData) {
      const patrolData = this.$store[patrol.getters.getPatrol].patrol(
        scannedData.code
      );
      if (!patrolData) {
        console.log("not a valid patrol");
        return;
      }

      this.$emit("patrol-data", patrolData);
      this.$emit("next-step");
    },
    async lookupStunt(scannedData) {
      const stuntData = this.$store.getters[stunt.getters.getStunt](
        scannedData.code
      );

      if (!stuntData) {
        console.log("not a valid stunt");
        return;
      }

      this.$emit("stunt-data", stuntData);
      this.$emit("next-step");
    },
  },
};
</script>
