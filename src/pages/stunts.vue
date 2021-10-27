<template>
  <v-row>
    <v-col xs="12" sm="6">
      <v-card>
        <v-card-title>Stunts</v-card-title>

        <v-card-text>Browse the stunts locations and teams.</v-card-text>
      </v-card>
    </v-col>
    <v-col xs="12" sm="12">
      <v-card>
        <v-card-text>
          <v-tabs vertical>
            <v-tab v-for="stunt in stunts" :key="stunt.title">
              <v-icon left>{{ stunt.icon }}</v-icon>
              {{ stunt.title }}
            </v-tab>

            <v-tab-item v-for="stunt in stunts" :key="stunt.title">
              <v-card flat>
                <v-card-title>
                  {{ stunt.title }}
                </v-card-title>

                <v-card-text>
                  <p>
                    {{ stunt.text }}
                  </p>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      stunts: [
        {
          title: "Stunt 1",
          icon: "mdi-forum",
          text: "/stunts/into-the-spiderverse",
        },
        { title: "Stunt 2", icon: "mdi-forum", text: "/stunts/marvel" },
        {
          title: "stunt 3",
          icon: "mdi-forum",
          text: "/stunts/DC-is-better-than-Marvel",
        },
        { title: "Stunt 4", icon: "mdi-forum", text: "/stunts/stunt-4" },
      ],
    };
  },
};
</script>