<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ stunt.name }}</v-card-title>

        <v-card-text v-html="stunt.description"></v-card-text>

        <v-card-text>Find this stunt: {{ stunt.location }}</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" v-if="activeUser && activeUser._type !== 'patrol'">
      <v-card>
        <v-card-title class="text-h4 d-flex flex-nowrap">
          <v-icon left large>mdi-qrcode</v-icon>
          <span>Share this stage</span>
        </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <qr-code
            :entity="{
              code: stunt.code,
              path: stunt.path,
              name: stunt.name,
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
    return store.getters.stunt(params.slug);
  },
  data() {
    return {};
  },
  computed: {
    stunt() {
      return this.$store.getters.stunt(this.$route.params.slug);
    },
    activeUser(): AppUserEntity | null {
      return this.$store.getters.user;
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
