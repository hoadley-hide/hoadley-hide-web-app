<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">Dev Links</v-card-title>

        <v-card-text v-if="impersonator">
          <v-btn block @click="deposter">
            Return to being
            {{ impersonator.name }} ({{ impersonator._type }})
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="6" md="4" v-for="(entityList, key) in entities" :key="key">
      <v-card>
        <v-card-title>
          {{ key | capitalize }}
        </v-card-title>
        <v-card-text
          v-for="entity in entityList"
          :key="entity.code"
          class="d-flex"
        >
          <span class="d-flex flex-column align-start">
            <code>Name</code>
            <p>{{ entity.name }}</p>
          </span>
          <v-spacer></v-spacer>
          <v-btn x-small color="primary" nuxt :to="entity.path">View</v-btn>
          <v-btn x-small color="secondary" nuxt @click="impersonate(entity)">
            Impersonate
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { createAlert, setBreadcrumbs } from "~/common/helper-factories";
import { QrCodeableEntity } from "~/types";

type EntityType = QrCodeableEntity["_type"];

export default {
  data() {
    return {};
  },
  computed: {
    entities(): Record<EntityType, any> {
      return {
        admin: this.$store.state.admins,
        patrol: this.$store.state.patrols,
        stunt: this.$store.state.stunts,
        eventStage: this.$store.state.eventStages,
        monsterHuntMonster: this.$store.state.monsterHuntMonsters,
      };
    },
    impersonator() {
      return this.$store.state.impersonator;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/app", label: "App" },
      { to: null, label: "Dev" },
    ]);
  },
  methods: {
    async impersonate(entity) {
      await this.$store.dispatch("persistUser", {
        ...entity,
        impersonate: true,
      });

      await createAlert(this.$store, {
        message: `You are impersonating ${entity.name}`,
        type: "success",
      });

      this.$router.push(entity.path);
    },

    async deposter() {
      await this.$store.dispatch("persistUser", {
        impersonate: false,
      });

      await createAlert(this.$store, {
        message: `Returning to ${this.$store.getters.user.name}`,
        type: "warning",
      });

      this.$router.push("/");
    },
  },
};
</script>
