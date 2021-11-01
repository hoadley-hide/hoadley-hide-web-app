<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Stunts</v-card-title>

        <v-card-text>Browse the stunts locations and teams.</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="stunt in stunts"
              :key="stunt.title"
              :to="`/stunts/${stunt.slug}`"
            >
              <v-icon left>{{ stunt.icon }}</v-icon>
              <span class="tab-title-left-align">{{ stunt.name }}</span>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  data() {
    return {};
  },
  computed: {
    stunts() {
      return this.$store.state.stunts;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Stunts" },
    ]);
  },
};
</script>

<style scoped>
.tab-title-left-align {
  width: 100%;
  text-align: left;
}
</style>
