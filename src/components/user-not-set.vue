<template>
  <v-container class="breadcrumb-container">
    <v-row>
      <v-col class="pb-0 text-center">
        <v-card>
          <v-card-text class="text-body-2 font-weight-black success--text">
            Let us know who you are!
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-row>
              <v-col>
                <v-btn to="/user/patrol/setup" color="primary" text nuxt>
                  Patrol (Venturers &amp; Guides)
                </v-btn>
              </v-col>
              <v-col>
                <v-btn to="/user/stunt/setup" color="error" text nuxt>
                  Stunt (Rovers &amp; Adults)
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {};
</script>
