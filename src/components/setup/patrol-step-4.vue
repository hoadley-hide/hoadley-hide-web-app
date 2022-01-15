<template>
  <v-stepper-content step="4">
    <v-card class="mb-12" tile>
      <v-card-title class="text-h4">
        Take a photo of your Patrol!
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
        If you want to upload photos later, you can always access this link from
        the main menu.
      </v-card-text>
    </v-card>

    <v-btn block color="primary" @click="$emit('next-step')">Snap!</v-btn>
  </v-stepper-content>
</template>

<script lang="ts">
export default {
  props: ["stepActive"],
};
</script>
