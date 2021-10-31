<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>First Aid</v-card-title>

        <v-card-text> plz dont hurt your self </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "First Aid" },
    ]);
  },
};
</script>