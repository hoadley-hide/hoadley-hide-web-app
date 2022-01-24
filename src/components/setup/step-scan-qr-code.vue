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
      alert("Not supported yet.");
    },
    async lookupPatrol(scannedData) {
      const patrol = this.$store.getters.patrol(scannedData.code);
      if (!patrol) {
        console.log("not a valid patrol");
        return;
      }

      this.$emit("patrol-data", patrol);
      this.$emit("next-step");
    },
    async lookupStunt(scannedData) {
      const stunt = this.$store.getters.stunt(scannedData.code);
      if (!stunt) {
        console.log("not a valid stunt");
        return;
      }

      this.$emit("stunt-data", stunt);
      this.$emit("next-step");
    },
  },
};
</script>
