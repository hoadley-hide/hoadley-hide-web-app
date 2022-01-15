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
        <v-card-title class="text-h3">Refetch data</v-card-title>

        <v-card-text>
          <v-btn color="error" @click="refreshData" :loading="loading">
            Refresh local data
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Data Activity" },
    ]);
  },
  methods: {
    async refreshData() {
      this.loading = true;
      await this.$store.dispatch("initialiseAll");
      this.loading = false;
    },
  },
};
</script>
