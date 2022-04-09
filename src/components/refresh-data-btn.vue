<template>
  <v-btn
    block
    text
    :color="state === 'fetched' ? 'info' : 'red lighten-4'"
    @click="fetchMyEventLogs()"
    :loading="state === 'loading'"
  >
    Refresh Data
  </v-btn>
</template>

<script lang="ts">
export default {
  props: { onMountDisable: Boolean },
  data() {
    return {
      state: "fetched",
    };
  },
  async mounted() {
    if (this.onMountDisbled) {
      return;
    }
    this.fetchMyEventLogs();
  },
  methods: {
    async fetchMyEventLogs() {
      this.state = "loading";
      try {
        await this.$store.dispatch("fetchMyEventLogs", { syncMode: "diff" });
        this.state = "fetched";
      } catch (e) {
        this.state = "failed";
      }
    },
  },
};
</script>
