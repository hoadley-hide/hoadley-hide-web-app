<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ eventStage.name }}</v-card-title>
        <v-card-subtitle>
          Nominal stage start:
          {{ eventStage.startTime | datetime }}
        </v-card-subtitle>

        <v-card-text v-html="eventStage.description.html"> </v-card-text>
      </v-card>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      v-for="instruction in eventStage.instructions"
      v-bind:key="instruction.html"
    >
      <v-card>
        <v-card-text v-html="instruction.html"> </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h4 d-flex flex-nowrap">
          <v-icon left large>mdi-qrcode</v-icon>
          <span>Share this stage</span>
        </v-card-title>
        <v-card-text class="d-flex justify-space-around">
          <qr-code
            :entity="{
              code: eventStage.code,
              path: eventStage.path,
              name: eventStage.name,
            }"
          ></qr-code>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="py-0"><!-- Force the row reset --></v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/event">Back to The Adventure</v-btn>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block color="success" to="/scan">Open scanner</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import lazy from "~/components/lazy.vue";

export default {
  components: { lazy },
  validate({ params, store }) {
    return store.getters.eventStage(params.slug);
  },
  data() {
    return {};
  },
  computed: {
    eventStage() {
      return this.$store.getters.eventStage(this.$route.params.slug);
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/event", label: "The Adventure" },
      { to: null, label: this.eventStage.name },
    ]);
  },
};
</script>
