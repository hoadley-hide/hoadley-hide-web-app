<template>
  <v-stepper-content step="1">
    <v-card>
      <v-card-title class="text-h4">
        Setting up your {{ entity.toUpperCase() }}
      </v-card-title>
      <v-card-text class="success--text">
        Together we will set up your {{ entity }}
      </v-card-text>
      <v-card-text>
        <v-list>
          <v-list-item v-for="action in availableSteps" :key="action.label">
            <v-list-item-icon>
              <v-icon>{{ action.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ action.label }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-btn block class="mt-6" color="primary" @click="$emit('next-step')">
      Get Started
    </v-btn>
  </v-stepper-content>
</template>

<script lang="ts">
export default {
  props: ["entity", "availableSteps"],
};
</script>
