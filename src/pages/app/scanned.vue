<template>
  <v-row>
    <v-col cols="12" sm="6">
      <client-only>
        <template v-slot:placeholder>
          <v-card>
            <v-card-title class="text-h3">Scanned Codes</v-card-title>
            <v-skeleton-loader
              type="list-item-three-line@2"
            ></v-skeleton-loader>
          </v-card>
        </template>
        <v-card>
          <v-card-title class="text-h3">Scanned Codes</v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item
                v-for="scannedCode in scannedCodes"
                v-bind:key="scannedCode.key"
              >
                <v-list-item-content>
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="body-1">
                        {{ scannedCode.entity.name }}
                      </div>
                      <div>
                        <span class="text--secondary">Type:</span>
                        <code>{{ scannedCode.entity._type | capitalize }}</code>
                      </div>
                      <div>
                        <span class="text--secondary">Time:</span>
                        <code>{{ scannedCode.time | datetime }}</code>
                      </div>
                    </div>
                    <v-chip>
                      {{ scannedCode.ago }}
                    </v-chip>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="scannedCodes.length === 0">
                <i>No codes scanned</i>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-text v-if="scannedCodes.length !== 0">
            <v-btn color="info" block text @click="clearScannedCodes">
              Clear scanned codes
            </v-btn>
          </v-card-text>
        </v-card>
      </client-only>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { ScannedCode } from "~/types";

export default {
  computed: {
    scannedCodes(): ScannedCode {
      return this.$store.getters.scannedCodes
        .map((code) => ({
          key: code.time,
          time: new Date(code.time),
          ago: this.$options.filters?.duration(new Date(code.time)),
          entity: this.$store.getters.findById(code.code),
        }))
        .filter((x) => x.entity)
        .reverse();
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/app", label: "App" },
      { to: null, label: "Scanned Codes" },
    ]);
  },
};
</script>
