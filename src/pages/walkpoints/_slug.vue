<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ walkpoint.name }}</v-card-title>

        <v-card-text v-html="walkpoint.description.html"></v-card-text>
      </v-card>
    </v-col>

    <!-- Check in walkpoint -->
    <v-col
      cols="12"
      sm="6"
      v-if="$auth(['patrol:canCheckpoint:walkpoint:capture'])"
    >
      <checkpoint-walkpoint :walkpoint="walkpoint"></checkpoint-walkpoint>
    </v-col>

    <v-col cols="12" sm="6" v-show="$auth(['walkpoint:canShare'])">
      <v-card>
        <v-card-title class="text-h4 d-flex flex-nowrap">
          <v-icon left large>mdi-qrcode</v-icon>
          <span>Share this walkpoint</span>
        </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <qr-code
            :entity="{
              code: walkpoint.code,
              path: walkpoint.path,
              name: walkpoint.name,
            }"
          ></qr-code>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="py-0"><!-- Force the row reset --></v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/walkpoints">Back to Walkpoints</v-btn>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block color="success" to="/scan">Open scanner</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Walkpoint } from "~/types";
import { names as walkpoint } from "~/store/walkpoint";

export default {
  validate({ params, store }) {
    return store.getters[walkpoint.getters.getWalkpoint](params.slug);
  },
  data() {
    return {};
  },
  computed: {
    walkpoint(): Walkpoint[] {
      return this.$store.getters[walkpoint.getters.getWalkpoint](
        this.$route.params.slug
      );
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/walkpoints", label: "Walkpoints" },
      { to: null, label: this.walkpoint.name },
    ]);
    this.$store.dispatch("fetchMyEventLogs", { syncMode: "diff" });
  },
};
</script>
