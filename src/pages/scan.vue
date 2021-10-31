<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title>Scan QR code</v-card-title>

        <client-only placeholder="Loading...">
          <qrcode-stream @decode="onDecode"></qrcode-stream>
        </client-only>

        <v-card-text>
          {{ decodedString }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { setBreadcrumbs } from "~/common/helper-factories";

export default {
  data() {
    return {
      decodedString: "",
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Scan" },
    ]);
  },
  methods: {
    onDecode(decodedString) {
      this.decodedString = decodedString;
    },
  },
};
</script>