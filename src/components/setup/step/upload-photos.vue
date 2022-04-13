<template>
  <v-stepper-content :step="step">
    <v-card class="mb-12" tile>
      <v-card-title class="text-h4">
        Take a photo of your {{ entity.toUpperCase() }}!
      </v-card-title>
      <v-card-text>
        Capture the moment! During Hoadley Hide you will be able to upload your
        photos for us to share.
      </v-card-text>
      <v-card-text>
        <v-btn
          text
          link
          block
          color="success"
          href="https://cloud.snowdrift.com.au/s/ogsYfAe4Er4cDa9"
          target="_blank"
        >
          Upload photos here
        </v-btn>
      </v-card-text>
      <v-card-text>
        To access later, <code>Upload Photos</code> can be uploaded via the main
        menu.
      </v-card-text>
    </v-card>

    <v-btn block color="primary" @click="$emit('next-step')">
      Start Adventure
    </v-btn>
  </v-stepper-content>
</template>

<script lang="ts">
export default {
  props: ["entity", "step"],
};
</script>
