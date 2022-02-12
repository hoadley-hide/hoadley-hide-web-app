<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">{{ monstemonGo.name }}</v-card-title>

        <v-card-text v-html="monstemonGo.description.html"></v-card-text>

        <v-card-text
          >Find this Monstemon Go: {{ monstemonGo.location }}</v-card-text
        >
      </v-card>
    </v-col>
    <authorised :allow="['monstermonGo:canShare']">
      <v-col cols="12" sm="6">
        <v-card>
          <v-card-title class="text-h4 d-flex flex-nowrap">
            <v-icon left large>mdi-qrcode</v-icon>
            <span>Share this stage</span>
          </v-card-title>
          <v-card-text class="d-flex justify-space-around">
            <qr-code
              :entity="{
                code: monstemonGo.code,
                path: monstemonGo.path,
                name: monstemonGo.name,
              }"
            ></qr-code>
          </v-card-text>
        </v-card>
      </v-col>
    </authorised>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { MonstemonGo } from "~/types";

export default {
  validate({ params, store }) {
    return store.getters.monstemonGo(params.slug);
  },
  data() {
    return {};
  },
  computed: {
    monstemonGo(): MonstemonGo {
      return this.$store.getters.monstemonGo(this.$route.params.slug);
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/monstemonGos", label: "Stunts" },
      { to: null, label: this.monstemonGo.name },
    ]);
  },
};
</script>
