<template>
  <v-stepper-content step="3">
    <v-card>
      <v-card-title class="text-h4">
        Confim all of your Patrol is here!
      </v-card-title>
      <v-card-text>
        <v-list v-if="patrol && patrol.members">
          <v-list-item v-for="member in patrol.members" :key="member.label">
            <v-list-item-content>
              <v-list-item-title>
                {{ member.fullname }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ member.formation }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-btn block class="mt-6" color="primary" @click="$emit('next-step')">
      Okie! All Here
    </v-btn>
    <v-btn
      block
      class="mt-6"
      color="warning"
      outlined
      @click="memberMismatchWarning = true"
    >
      Hang on a minute..
      <br />
      something isnt right
    </v-btn>
    <v-dialog v-model="memberMismatchWarning" width="500">
      <v-card>
        <v-card-title class="text-h5"> Something the matter? </v-card-title>

        <v-card-text class="warning--text">
          Missing patrol members?
          <br />
          EXTRA patrol members????
        </v-card-text>

        <v-card-text class="success--text">
          Please contact a Hoadley Hide staff memeber for further assistance.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="memberMismatchWarning = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-stepper-content>
</template>

<script lang="ts">
export default {
  props: ["patrol"],
  data() {
    return { memberMismatchWarning: false };
  },
};
</script>
