<template>
  <v-row>
    <v-col cols="12" sm="8" offset-sm="2">
      <v-card>
        <v-card-title class="text-h3">Pending requests</v-card-title>
        <v-card-text v-if="retryCounter > 0">
          Currently retrying {{ retryCounter }} requests.
        </v-card-text>
        <v-list>
          <v-list-item
            v-for="request in pendingRequests"
            :key="request.deduplicationId"
          >
            <v-list-item-content>
              <span>
                Type: <code>{{ request.type }}</code>
              </span>
              <br />
              Unique ID: <code>{{ request.deduplicationId }}</code>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                :color="isRetryActive(request.deduplicationId) ? 'green' : ''"
                :loading="isRetryActive(request.deduplicationId)"
                @click="handleRetry(request)"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-list-item v-if="pendingRequests.length === 0">
            <v-list-item-content>
              <span>
                <span>There are no pending requests.</span>
                <span class="green--text text--darken-4">lov ya work</span>
              </span>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { EventLog, EventLogAugmented } from "~/types";

export default {
  data() {
    return {
      retrying: [] as string[],
    };
  },
  computed: {
    pendingRequests(): EventLogAugmented[] {
      return this.$store.getters.pendingRequests;
    },
    isRetryActive() {
      return (deduplicationId: string) =>
        this.retrying.includes(deduplicationId);
    },
    retryCounter(): number {
      return this.retrying.length;
    },
  },
  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/app", label: "App & Data" },
      { to: null, label: "Pending Requests" },
    ]);
  },
  methods: {
    async handleRetry(request: EventLogAugmented) {
      const logData: EventLog = {
        deduplicationId: request.deduplicationId,
        version: new Date().toISOString(),
        hash: request.hash,
        eventName: request.eventName,
        type: request.type,
        recordingEntity: request.recordingEntity,
        referencedEntity: request.referencedEntity,
        data: request.data,
      };

      try {
        this.retrying.push(request.deduplicationId);

        await this.$store.dispatch("persistEventLog", logData);

        await this.$createAlert({
          heading: `Request retry suceeded`,
          message: `${request.type} - ${request.deduplicationId}`,
          type: "success",
        });
      } catch (e) {
        await this.$createAlert({
          heading: `Request retry failed`,
          message: `${request.type} - ${request.deduplicationId} - ${e?.message}`,
          type: "error",
        });
      } finally {
        this.retrying.splice(this.retrying.indexOf(request.deduplicationId), 1);
      }
    },
  },
};
</script>
