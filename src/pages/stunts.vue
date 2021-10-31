<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>Stunts</v-card-title>

        <v-card-text>Browse the stunts locations and teams.</v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-tabs center-active>
            <v-tab v-for="stunt in stunts" :key="stunt.title">
              <v-icon left>{{ stunt.icon }}</v-icon>
              <span class="tab-title-left-align">{{ stunt.name }}</span>
            </v-tab>

            <v-tab-item v-for="stunt in stunts" :key="stunt.title">
              <v-card flat>
                <v-card-title>{{ stunt.title }}</v-card-title>

                <v-card-text>
                  <p v-html="stunt.description"></p>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
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