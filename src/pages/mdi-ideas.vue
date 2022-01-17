<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="text-h3">mdi suggestions</v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item
              v-for="mdiSuggestion in mdiSuggestions"
              v-bind:key="mdiSuggestion.mdi"
            >
              <v-list-item-icon>
                <v-icon>
                  {{
                    mdiSuggestion.mdi.replace(
                      /[A-Z]/g,
                      (match) => "-" + match.toLowerCase()
                    )
                  }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ mdiSuggestion.mdi }}</v-list-item-title>
              <v-list-item-subtitle>{{
                mdiSuggestion.use
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
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
      mdiSuggestions: [
        { mdi: "mdiHome", use: "home" },
        { mdi: "mdiHeadCogOutline", use: "Problem Solving" },
        { mdi: "mdiCow", use: "cow head" },
        { mdi: "mdiBusStop", use: "bus stop" },
        { mdi: "mdiCompassRose", use: "compass rose" },
        { mdi: "mdiCompass", use: "compass solid" },
        { mdi: "mdiMap", use: "map" },
        { mdi: "mdiCastle", use: "castle" },
        { mdi: "mdiForest", use: "forest trees" },
        { mdi: "mdiTerrain", use: "terrain 2 mountains" },
        { mdi: "mdiHiking", use: "hiking" },
        { mdi: "mdiTrophy", use: "trophy" },
        { mdi: "mdiInstagram", use: "instagram" },
        { mdi: "mdiFacebook", use: "facebook" },
        { mdi: "mdiFacebookMessenger", use: "messenger" },
        { mdi: "mdiBiohazard", use: "biohazard" },
        { mdi: "mdiRadioactive", use: "radioactive" },
        { mdi: "mdiScaleBalance", use: "scale" },
        { mdi: "mdiFlask", use: "chemistry flask" },
        { mdi: "mdiDna", use: "dna" },
        { mdi: "mdiCamera", use: "camera" },
        { mdi: "mdiBat", use: "bat" },
        { mdi: "mdiBottleTonicSkull", use: "skull bottle" },
        { mdi: "mdiSpiderWeb", use: "web" },
        { mdi: "mdiEggEaster", use: "easter egg" },
        { mdi: "mdiCoffin", use: "coffin" },
        { mdi: "mdiFire", use: "flame" },
        { mdi: "mdiHomeMapMarker", use: "house map marker" },
        { mdi: "mdiRobot", use: "Robot" },
        { mdi: "mdiShieldMoon", use: "moon on shield" },
        { mdi: "mdiMapMarkerRadius", use: "map marker" },
        { mdi: "mdiWater", use: "water drop" },
        { mdi: "mdiAxe", use: "axe" },
        { mdi: "mdiHammerWrench", use: "tools" },
        { mdi: "mdiEarth", use: "globe" },
        { mdi: "mdiGhostOutline", use: "ghost" },
        { mdi: "mdiShieldSword", use: "shield and sword" },
        { mdi: "mdiShieldCrown", use: "shield and crown" },
        { mdi: "mdiWizardHat", use: "wizard hat" },
        { mdi: "mdiSpaceInvaders", use: "Space invaders alien" },
        { mdi: "mdiPuzzle", use: "puzzle piece" },
        { mdi: "mdiSwordCross", use: "crossed swords" },
        { mdi: "mdiEmoticonDevil", use: "devil solid" },
        { mdi: "mdiBusClock", use: "bus with clock" },
        { mdi: "mdiPhoneClassic", use: "old phone" },
        { mdi: "mdiSpeaker", use: "speaker " },
        { mdi: "mdiWaveform", use: "waveform" },
        { mdi: "mdiMusic", use: "music notes" },
      ],
    };
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: null, label: "mdi suggestions" },
    ]);
  },
};
</script>
