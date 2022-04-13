<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">VOC</v-card-title>

        <v-card-text>Yo Yo Yo. gonna be done tonight</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/voc/music">music</v-btn>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/voc/checkin">CHeckinz</v-btn>
    </v-col>

    <v-col cols="12" class="py-0"><!-- Force the row reset --></v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/">Home</v-btn>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block color="success" to="/scan">Open scanner</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  data() {
    return {};
  },
  computed: {},
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: null, label: "VOC" },
    ]);
  },
};
</script>
