<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">All QR Codes</v-card-title>

        <v-card-text>
          <v-radio-group v-model="entityType">
            <v-radio
              v-for="entityType in entityTypes"
              :key="entityType.value"
              :label="entityType.label"
              :value="entityType.value"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-text>
          <div v-for="codeEntity in codeEntities" v-bind:key="codeEntity.code">
            <p>
              <strong>{{ entityType | capitalize }}: </strong>
              <code>{{ codeEntity.name }}</code>
            </p>
            <div class="d-flex justify-space-around">
              <qr-code :entity="codeEntity"></qr-code>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { QrCodeableEntity, CodeEntity } from "~/types";

export default {
  data() {
    return {
      entityType: "patrol" as QrCodeableEntity["_type"],
      entityTypes: [
        { label: "Admins", value: "admin" },
        { label: "Event Stage", value: "eventStage" },
        { label: "Monster Hunt Monsters", value: "monsterHuntMonster" },
        { label: "Patrols", value: "patrol" },
        { label: "Stunts", value: "stunt" },
      ] as { label: string; value: QrCodeableEntity["_type"] }[],
    };
  },
  computed: {
    codeEntities(): CodeEntity[] {
      let entities: QrCodeableEntity[] = [];

      switch (this.entityType) {
        case "admin":
          entities = this.$store.state.admins;
          break;
        case "eventStage":
          entities = this.$store.state.eventStages;
          break;
        case "monsterHuntMonster":
          entities = this.$store.state.monsterHuntMonsters;
          break;
        case "patrol":
          entities = this.$store.state.patrols;
          break;
        case "stunt":
          entities = this.$store.state.stunts;
          break;
      }

      return entities.map(
        (entity): CodeEntity => ({
          code: entity.code,
          path: entity.path,
          name: entity.name,
        })
      );
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/app", label: "App" },
      { to: null, label: "Printing List" },
    ]);
  },
};
</script>
