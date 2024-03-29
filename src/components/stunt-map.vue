<template>
  <div>
    <svg
      class="svg-canvas"
      viewBox="0 0 4960 3507"
      version="1.1"
      id="svg5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="importedtracks">
        <use xlink:href="/Whole Site Secret.svg#Map-Roads" />
        <use xlink:href="/Whole Site Secret.svg#Map-Railway-Line" />
        <use xlink:href="/Whole Site Secret.svg#Map-Crown-Land" />
        <use v-if="showGrids" xlink:href="/Whole Site Secret.svg#Map-Grids" />
      </g>
      <g id="stunts">
        <circle
          v-for="stunt in stunts"
          :key="stunt.code"
          :cx="getX(stunt)"
          :cy="getY(stunt)"
          r="75"
          stroke="red"
          fill="red"
          stroke-width="10"
          @click="openOverlay(stunt)"
        ></circle>
      </g>
      <g id="walkpoints">
        <circle
          v-for="walkpoint in walkpoints"
          :key="walkpoint.code"
          :cx="getX(walkpoint)"
          :cy="getY(walkpoint)"
          r="75"
          stroke="blue"
          fill="blue"
          stroke-width="10"
          @click="openOverlay(walkpoint)"
        ></circle>
      </g>
    </svg>
    <div>
      <v-checkbox v-model="showGrids" label="Show Grid"></v-checkbox>
    </div>
    <v-dialog v-model="overlayOpen" scrollable>
      <v-card v-if="overlay">
        <v-card-title class="text-h5">
          {{ overlay.name }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px" v-html="overlay.description.html">
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info darken-1" text @click="closeOverlay()">
            Close
          </v-btn>
          <v-btn color="green" text @click="$router.push(overlay.path)">
            See more
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Stunt, Walkpoint } from "~/types";
import { names as stuntStore } from "~/store/stunt";
import { names as walkpointStore } from "~/store/walkpoint";

export default {
  data() {
    return {
      overlay: null,
      overlayOpen: false,
      showGrids: false,
      mapping: {
        sixfig: {
          topLeft: {
            x: 360,
            y: 220,
          },
          bottomRight: {
            x: 420,
            y: 180,
          },
        },
        svg: {
          topLeft: {
            x: 214,
            y: 80,
          },
          bottomRight: {
            x: 214 + 4177,
            y: 80 + 2786,
          },
        },
      },
    };
  },
  computed: {
    stunts(): Stunt[] {
      return this.$store.getters[stuntStore.getters.getStunts].filter(
        (stunt: Stunt) => stunt.coordinates?.x && stunt.coordinates?.y
      );
    },
    walkpoints(): Walkpoint[] {
      return this.$store.getters[walkpointStore.getters.getWalkpoints].filter(
        (walkpoint: Walkpoint) =>
          walkpoint.coordinates?.x && walkpoint.coordinates?.y
      );
    },
  },
  methods: {
    openOverlay(entity: Stunt | Walkpoint) {
      this.overlayOpen = true;
      this.overlay = entity;
    },
    closeOverlay() {
      this.overlayOpen = false;
      this.overlay = null;
    },

    getX(entity: Stunt | Walkpoint) {
      if (!entity.coordinates?.x) {
        return;
      }

      const ratio =
        (this.mapping.sixfig.bottomRight.x - this.mapping.sixfig.topLeft.x) /
        (this.mapping.svg.bottomRight.x - this.mapping.svg.topLeft.x);

      return (
        (entity.coordinates.x - this.mapping.sixfig.topLeft.x) / ratio +
        this.mapping.svg.topLeft.x
      );
    },
    getY(entity: Stunt | Walkpoint) {
      if (!entity.coordinates?.y) {
        return;
      }

      const ratio =
        (this.mapping.sixfig.bottomRight.y - this.mapping.sixfig.topLeft.y) /
        (this.mapping.svg.bottomRight.y - this.mapping.svg.topLeft.y);

      return (
        (entity.coordinates.y - this.mapping.sixfig.topLeft.y) / ratio +
        this.mapping.svg.topLeft.y
      );
    },
  },
};
</script>

<style lang="css">
.svg-canvas {
  width: 100%;
}
#tracks path {
  fill: none;
  stroke: white !important;
  stroke-width: 10px;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-opacity: 1;
}

#importedtracks,
#Map-Grids,
#Map-Railway-Line,
#Map-Crown-Land {
  display: inline !important;
}

#Map-Grids [stroke="#000000"] {
  stroke: blue !important;
}
#Map-Railway-Line [stroke="#000000"] {
  stroke: white !important;
}

#Map-Roads g[stroke="#ff0000"] {
  fill: none;
  stroke: #ffffff !important;
  stroke-width: 10px;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-opacity: 1;
}
</style>
