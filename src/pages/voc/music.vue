<template>
  <div>
    <v-row>
      <v-col cols="12" class="py-0"><!-- Force the row reset --></v-col>
      <v-col cols="12" sm="6">
        <v-btn block nuxt to="/">Home</v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn block color="success" to="/scan">Open scanner</v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfYIWJkQ8kclbbz2wZ5hQ6ILHXbcbF_Tb8wje9CLjJTlBak8g/viewform?embedded=true"
          ref="iframe"
          :width="parentWidth"
          height="2000"
          scrolling="no"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >
          Loading form...
        </iframe>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentWidth: 100,
    };
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/voc", label: "VOC" },
      { to: null, label: "Music" },
    ]);

    this.fixWidth();
    setInterval(this.fixWidth, 5000);
  },
  methods: {
    fixWidth() {
      this.parentWidth = this.$refs.iframe.parentElement.clientWidth;
    },
  },
};
</script>
