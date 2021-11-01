<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>
          <v-icon left>{{ stunt.icon }}</v-icon>
          {{ stunt.name }}
        </v-card-title>

        <v-card-text v-html="stunt.description"></v-card-text>

        <v-card-text>Find this stunt: {{ stunt.location }}</v-card-text>
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
              :logoSrc="`/cropped-hhemblem-colour-hires-youtube-192x192.png`"
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
    return store.getters.stunt(params.slug);
  },
  data() {
    return {};
  },
  computed: {
    stunt() {
      return this.$store.getters.stunt(this.$route.params.slug);
    },
    qrCodeUrl() {
      return `https://hoadley-hide.netlify.app/scan?code=${this.stunt.shortId}`;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/stunts", label: "Stunts" },
      { to: null, label: this.stunt.name },
    ]);
  },
};
</script>
