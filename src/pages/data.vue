<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">Data pending upload</v-card-title>

        <v-card-text> none </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">Scanned Codes</v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item
              v-for="scannedCode in scannedCodes"
              v-bind:key="scannedCode.time"
            >
              {{ scannedCode.code }}
            </v-list-item>
            <v-list-item v-if="scannedCodes.length === 0">
              <i>No codes scanned</i>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-text v-if="scannedCodes.length !== 0">
          <v-btn color="info" @click="clearScannedCodes">
            Clear scanned codes
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">Refetch data</v-card-title>

        <v-card-text>
          <v-btn color="warning" @click="refreshData" :loading="loading">
            Refresh local data
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">Reset app</v-card-title>

        <v-card-text>
          <v-btn color="error" @click="resetApp"> Reset app data </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { ScannedCode } from "~/types";

export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    scannedCodes(): ScannedCode {
      return this.$store.getters.scannedCodes;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Data Activity" },
    ]);
  },
  methods: {
    async clearScannedCodes() {
      this.$store.dispatch("clearScannedCodes");
    },
    async refreshData() {
      this.loading = true;
      await this.$store.dispatch("initialiseAll");
      this.loading = false;
    },
    async resetApp() {
      await this.$store.dispatch("resetApp");
      this.$router.push("/");
    },
  },
};
</script>
