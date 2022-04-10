<template>
  <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-card>
        <v-card-title class="text-h3">Dev Links</v-card-title>

        <v-card-text v-if="impersonator">
          <v-btn block outlined color="purple" @click="deposter">
            Return to being
            {{ impersonator.name }} ({{ impersonator._type }})
          </v-btn>
          <p class="text-body-1 pt-5">
            You are impersonating <br />
            <i>
              "{{ $useUser((u) => u.name) }}" ({{ $useUser((u) => u._type) }})
            </i>
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      cols="12"
      sm="6"
      md="4"
      v-for="(entityList, key) in entities"
      :key="key"
    >
      <v-card>
        <v-card-text class="d-flex">
          <span class="d-flex flex-column align-start">
            <h4>{{ key | capitalize }}</h4>
          </span>
          <v-spacer></v-spacer>
          <span class="d-flex flex-column btn-group">
            <v-btn x-small color="primary" nuxt to="" disabled>View</v-btn>
            <v-btn x-small color="green" @click="scanEntity(key, 'add')">
              Scan All
            </v-btn>
            <v-btn x-small color="warning" @click="scanEntity(key, 'remove')">
              Un-scan All
            </v-btn>
          </span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text
          v-for="entity in entityList"
          :key="entity.code"
          class="d-flex"
        >
          <span class="d-flex flex-column align-start">
            <p>{{ entity.name }}</p>

            <p v-show="entityScanned(entity)" class="green--text">
              <i>Has been scanned</i>
            </p>
          </span>
          <v-spacer></v-spacer>
          <span class="d-flex flex-column btn-group">
            <v-btn x-small color="primary" nuxt :to="entity.path">View</v-btn>
            <v-btn x-small color="green" @click="toggleScan(entity)">
              Toggle Scan
            </v-btn>
            <v-btn x-small color="secondary" @click="impersonate(entity)">
              Impersonate
            </v-btn>
          </span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
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
        patrol: this.$store.state.patrol.patrols,
        stunt: this.$store.state.stunt.stunts,
        eventStage: this.$store.state.eventStages,
        monsterHuntMonster: this.$store.state.monsterHuntMonsters,
        walkpoint: this.$store.state.walkpoint.walkpoints,
      };
    },
    entityScanned() {
      return (entity) => {
        return this.$store.getters.hasCodeBeenScanned(entity.code);
      };
    },
    impersonator() {
      return this.$store.state.impersonator;
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/app", label: "App & Data" },
      { to: null, label: "Dev" },
    ]);
  },
  methods: {
    async scanEntity(entityType: EntityType, action: "add" | "remove") {
      for await (const entity of this.entities[entityType]) {
        await this.toggleScan(entity, action);
      }
    },

    async toggleScan(entity, action: "add" | "remove" | "toggle" = "toggle") {
      const scanned = this.entityScanned(entity);

      if (action === "add" && scanned) {
        return;
      }
      if (action === "remove" && !scanned) {
        return;
      }

      let actionable = action;
      if (action === "toggle") {
        actionable = scanned ? "remove" : "add";
      }

      if (actionable === "add") {
        await this.$store.dispatch("recordCodeScan", entity);

        await this.$createAlert({
          message: `Code ${entity.code} recorded as scanned`,
          type: "success",
        });
      } else {
        await this.$store.dispatch("removeCodeScan", entity.code);

        await this.$createAlert({
          message: `Code ${entity.code} recorded as not scanned`,
          type: "warning",
        });
      }
    },

    async impersonate(entity) {
      await this.$store.dispatch("persistUser", {
        ...entity,
        impersonate: true,
      });

      await this.$createAlert({
        message: `You are impersonating ${entity.name}`,
        type: "success",
      });

      this.$router.push(entity.path);
    },

    async deposter() {
      await this.$store.dispatch("persistUser", {
        impersonate: false,
      });

      await this.$createAlert({
        message: `Returning to ${this.$store.getters.user.name}`,
        type: "warning",
      });

      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.btn-group > *:first-child {
  border-radius: 4px 4px 0 0;
}
.btn-group > *:not(:first-child):not(:last-child) {
  border-radius: 0;
}
.btn-group > *:last-child {
  border-radius: 0 0 4px 4px;
}
</style>
