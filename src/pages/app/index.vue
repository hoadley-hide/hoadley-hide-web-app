<template>
  <div>
    <btn-block :btnBlocks="btnBlocks"></btn-block>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h3">Danger Area</v-card-title>

          <v-row>
            <v-col cols="12" sm="6">
              <v-card-subtitle class="overline">
                Refresh local data
              </v-card-subtitle>
              <v-card-text>
                <p>
                  Clicking this will attempt to fetch new / updated stunts,
                  adventures, patrols, etc for you.
                </p>
                <v-btn
                  color="warning"
                  block
                  text
                  @click="refreshData"
                  :loading="loading"
                >
                  Refresh local data
                </v-btn>
              </v-card-text>
            </v-col>
            <v-col cols="12" sm="6">
              <v-card-subtitle class="overline">
                Reset app data
              </v-card-subtitle>
              <v-card-text>
                <p>
                  This clears all scanned codes, identified monsters, unlocked
                  content, and deletes any pending requests (reviews, patrol
                  check ins)
                </p>
                <p class="red--text text-body-1">This is a dangerous action</p>
                <v-btn color="error" block @click="resetAppDialog = true">
                  Reset app data
                </v-btn>
                <v-dialog v-model="resetAppDialog" max-width="350">
                  <v-card>
                    <v-card-title class="text-h5">
                      Reset App Data
                    </v-card-title>
                    <v-card-text>
                      <p>
                        This clears all scanned codes, identified monsters,
                        unlocked content, and deletes any pending requests
                        (reviews, patrol check ins)
                      </p>
                      <p class="red--text text-body-1">
                        This is a dangerous action
                      </p>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn text @click="resetAppDialog = false">
                        Stop, Go Back
                      </v-btn>
                      <v-btn color="error black--text" @click="resetApp">
                        Clear Data
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { authorised } from "~/common/authorisation";
import { createAlert, setBreadcrumbs } from "~/common/helper-factories";
import { ScannedCode } from "~/types";

export default {
  data() {
    return {
      loading: false,
      resetAppDialog: false,
    };
  },
  computed: {
    btnBlocks() {
      const blocks = [
        {
          title: "Pending Data",
          subtitle: `${
            this.pendingIds ? this.pendingIds : "No"
          } requests pending`,
          to: "/app/pending",
          colour: this.pendingIds === 0 ? "success" : "error",
        },
        {
          title: "Reviews",
          subtitle: authorised(this.$store, ["stunt:canReview"])
            ? "See the reviews you have made"
            : "See the reviews made about you",
          to: "/reviews",
          colour: "orange",
        },
        {
          title: "QR Codes Scanned",
          subtitle: `${
            this.scannedCodes ? this.scannedCodes : "No"
          } codes scanned`,
          to: "/app/scanned",
          colour: "black",
        },
      ];

      if (authorised(this.$store, ["app:seePrintingList"])) {
        blocks.push({
          title: "Printing list",
          subtitle: "",
          to: "/app/printing",
          colour: "blue",
        });
      }

      return blocks;
    },
    pendingIds() {
      return this.$store.state.pendingLogIds.length;
    },
    scannedCodes() {
      return this.$store.getters.scannedCodes.length;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "Data Activity" },
    ]);
  },
  methods: {
    async clearScannedCodes() {
      this.$store.dispatch("clearScannedCodes");
    },
    async refreshData() {
      this.loading = true;

      const timeout = setTimeout(() => {
        createAlert(this.$store, {
          message: "Unable to refresh the app data",
          type: "error",
        });
      }, 10000);

      await this.$store.dispatch("initialiseAll");
      clearTimeout(timeout);
      this.loading = false;
    },
    async resetApp() {
      await this.$store.dispatch("resetApp");
      this.$router.push("/");
    },
  },
};
</script>
