<template>
  <v-stepper-content step="2">
    <qr-code-scan v-if="stepActive" @valid-code="handleValidCode">
      <v-card-title class="text-h4"> Scan your patrol's QR Code </v-card-title>
    </qr-code-scan>
  </v-stepper-content>
</template>

<script lang="ts">
export default {
  props: ["stepActive"],
  methods: {
    async handleValidCode(scannedData) {
      const patrol = this.$store.getters.patrol(scannedData.shortId);
      if (!patrol) {
        console.log("not a valid patrol");
        return;
      }

      this.$emit("patrol-data", patrol);
      this.$emit("next-step");
    },
  },
};
</script>
