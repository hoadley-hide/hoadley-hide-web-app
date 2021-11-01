<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>{{ eventStage.name }}</v-card-title>
        <v-card-subtitle>
          Nominal stage start:
          {{ eventStage.startTime | datetime }}
        </v-card-subtitle>

        <v-card-text v-html="eventStage.description"> </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="d-flex flex-nowrap">
          <v-icon left>mdi-qrcode</v-icon>
          <span>Share this stage</span>
        </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <client-only>
            <vue-qr
              :correctLevel="3"
              :text="qrCodeUrl"
              :size="500"
              :margin="20"
              :logoSrc="`/hh-qr-code-logo-192x192.png`"
              :logoScale="0.3"
              :logoCornerRadius="0"
              class="qr-code-image"
            ></vue-qr>
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  validate({ params, store }) {
    return store.getters.eventStage(params.slug);
  },
  data() {
    return {};
  },
  computed: {
    eventStage() {
      return this.$store.getters.eventStage(this.$route.params.slug);
    },
    qrCodeUrl() {
      return `https://hoadley-hide.netlify.app/scan?code=${this.eventStage.shortId}`;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/event", label: "Event" },
      { to: null, label: this.eventStage.name },
    ]);
  },
};
</script>

<style scoped>
.qr-code-image {
  width: 50vh;
  height: 50vh;
  max-width: 300px;
  max-height: 300px;
  border-radius: 4px;
}
</style>