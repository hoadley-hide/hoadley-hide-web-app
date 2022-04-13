<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">First Aid</v-card-title>

        <v-card-text>
          If you have an emergency, call the
          <a href="tel:0447281828">Hoadley Hide Emergency Number</a>
        </v-card-text>

        <v-card-text>
          For less serve needs, make your way to the closest stunt.
        </v-card-text>
      </v-card>
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

<script>
export default {
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: null, label: "First Aid" },
    ]);
  },
};
</script>
