<template>
  <v-row>
    <v-col
      v-for="btnBlock in btnBlocks"
      v-bind:key="btnBlock.title"
      cols="6"
      md="3"
    >
      <v-card
        :color="btnBlock.colour"
        class="d-flex flex-column align-center justify-center px-4"
        height="200"
        :to="btnBlock.to"
      >
        <div
          class="text-h4 text-center"
          :class="{ 'black--text': btnBlock.colour === 'yellow' }"
        >
          {{ btnBlock.title }}
        </div>
        <div
          v-show="btnBlock.subtitle"
          class="text-center"
          :class="{ 'black--text': btnBlock.colour === 'yellow' }"
        >
          {{ btnBlock.subtitle }}
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  props: {
    btnBlocks: Array,
  },
};
</script>
