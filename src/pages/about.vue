<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">About Hoadley Hide</v-card-title>

        <v-card-text>
          An annual Scouting activity (started back in 1952). It is a
          competitive event where Teams of Venturers hike from activity to
          activity (called stunts), which are run by groups of Leaders and Rover
          Crews. A Rogaine and a night hike are some features added recently.
          Music, videos and a DJ feature at night time campsites. The Hide is
          organised by the Victorian State Venturer Scout Council of Scouts
          Australia and runs over the Easter period from Good Friday until
          Easter Monday. Venturer Scouts and Guides from all over the state (and
          from other states of Australia) come to take part in this exciting
          activity that is a highlight of the Venturing year.
        </v-card-text>
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
      { to: null, label: "About" },
    ]);
  },
};
</script>
