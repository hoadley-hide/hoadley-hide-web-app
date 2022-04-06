<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2"> Timeline </v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedDay"
            :items="days"
            label="Show timeline for "
            item-text="label"
            item-value="value"
          ></v-select>
        </v-card-text>
        <v-card-text>
          <v-btn
            block
            text
            color="info"
            @click="fetchMyEventLogs()"
            :loading="loading.fetchLogs"
          >
            Refresh Data
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6">
      <v-card>
        <v-card-text>
          <v-timeline align-top dense>
            <v-timeline-item
              v-for="timeline in timelines"
              :key="timeline.hash"
              :icon="timeline.icon"
              :color="timeline.colour"
              fill-dot
            >
              <v-card tile flat nuxt :to="timeline.to">
                <v-row no-gutters>
                  <v-col cols="12">
                    <strong>{{ timeline.title }}</strong>
                  </v-col>
                  <v-col offset="1" cols="11">
                    <span>
                      <span class="text--secondary">{{ timeline.action }}</span>
                      <strong v-if="timeline.time">
                        {{ timeline.time | datetime }}
                      </strong>
                    </span>
                  </v-col>
                  <v-col offset="1" cols="11">
                    <div class="text-caption text-truncate font-italic">
                      {{ timeline.subtitle }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="py-0"><!-- Force the row reset --></v-col>
    <v-col cols="12" sm="6">
      <v-btn block nuxt to="/">Home</v-btn>
    </v-col>
    <v-col cols="12" sm="6">
      <v-btn block color="success" to="/scan">Open scanner</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  AppUserEntity,
  EventLogAugmented,
  EventStage,
  Patrol,
  ScannedCode,
  Stunt,
} from "~/types";
import { names as stuntStore } from "~/store/stunt";
import { names as patrolStore } from "~/store/patrol";
import { names as eventLogStore } from "~/store/event-log";
import hasher from "object-hash";

interface Timeline {
  icon: string;
  title: string;
  action: string;
  subtitle: string;
  colour: string;
  time: string;
  to?: string;
}

export default {
  data() {
    return {
      loading: { fetchLogs: false },
      selectedDay: null,
      days: [
        { label: "Saturday", value: "saturday" },
        { label: "Sunday", value: "sunday" },
      ],
    };
  },
  computed: {
    timelines() {
      const timelines: Timeline[] = [];

      timelines.push(...this.eventStages);
      timelines.push(...this.checkpoints);
      timelines.push(...this.stunts);
      timelines.push(...this.patrols);

      const sorted = timelines
        .filter((timeline) => timeline.time)
        .sort((a: Timeline, b: Timeline) => {
          return Date.parse(b.time) - Date.parse(a.time);
        });

      return sorted.map((timeline) => {
        timeline.hash = hasher(timeline);
        return timeline;
      });
    },

    checkpoints(): Timeline[] {
      return this.$store.getters[eventLogStore.getters.getCheckpoints].flatMap(
        (eventLog: EventLogAugmented): Timeline[] => {
          const returnLogs: Timeline[] = [];
          const logPath = this.$useUser((u: AppUserEntity) =>
            u._type === "patrol"
              ? eventLog.recordingEntity?.path
              : eventLog.referencedEntity?.path
          );

          if (eventLog.type === "checkpoint:stunt:visit") {
            returnLogs.push({
              icon: "mdi-map-marker-radius",
              title: eventLog.referencedEntity?.name ?? "Unknown",
              action: "Checked in",
              subtitle: `at ${eventLog.recordingEntity?.name}`,
              colour: "green darken-4",
              time: eventLog.data?.["check-in-time"] ?? "",
              to: logPath,
            });
            returnLogs.push({
              icon: "mdi-map-marker-radius",
              title: eventLog.referencedEntity?.name ?? "Unknown",
              action: "Checked out",
              subtitle: `at ${eventLog.recordingEntity?.name}`,
              colour: "green darken-4",
              time: eventLog.data?.["check-out-time"] ?? "",
              to: logPath,
            });
          }

          if (eventLog.type === "checkpoint:voc:enter") {
            returnLogs.push({
              icon: "mdi-map-marker-radius",
              title: eventLog.referencedEntity?.name ?? "Unknown",
              action: "Entered the VOC",
              subtitle: "Hello!",
              colour: "green darken-4",
              time: eventLog.data?.["voc-check-in-time"] ?? "",
              to: eventLog.referencedEntity?.path,
            });
          }

          if (eventLog.type === "checkpoint:voc:exit") {
            returnLogs.push({
              icon: "mdi-map-marker-radius",
              title: eventLog.referencedEntity?.name ?? "Unknown",
              action: "Left the VOC",
              subtitle: "Bye...",
              colour: "green darken-4",
              time: eventLog.data?.["voc-check-out-time"] ?? "",
              to: eventLog.referencedEntity?.path,
            });
          }

          return returnLogs;
        }
      );
    },
    eventStages(): Timeline[] {
      return this.$store.getters.scannedEventStages.map(
        (eventStage: EventStage): Timeline => {
          const scanned: ScannedCode | undefined =
            this.$store.getters.hasCodeBeenScanned(eventStage.code);

          return {
            icon: eventStage.icon,
            title: eventStage.name,
            action: "Scanned",
            subtitle: eventStage.description.text,
            colour: "blue darken-4",
            time: scanned?.time ?? eventStage.startTime,
            to: eventStage.path,
          };
        }
      );
    },
    patrols(): Patrol[] {
      return this.$store.getters[patrolStore.getters.scannedPatrols].map(
        (patrol: Patrol): Timeline => {
          const scanned: ScannedCode | undefined =
            this.$store.getters.hasCodeBeenScanned(patrol.code);

          return {
            icon: "mdi-account-group",
            title: patrol.name,
            action: "Scanned",
            subtitle: `${patrol.members.length} members`,
            colour: "pink darken-4",
            time: scanned?.time ?? "",
            to: patrol.path,
          };
        }
      );
    },

    reviews(): Timeline[] {
      return this.$store.getters[eventLogStore.getters.getReviews].map(
        (eventLog: EventLogAugmented): Timeline => {
          const logPath = this.$useUser((u: AppUserEntity) =>
            u._type === "patrol"
              ? eventLog.referencedEntity?.path
              : eventLog.recordingEntity?.path
          );
          return {
            icon: "mdi-star",
            title: eventLog.recordingEntity?.name ?? "Unknown",
            action: "Reviewed",
            subtitle: `their time at ${eventLog.referencedEntity?.name}`,
            colour: "orange darken-4",
            time: eventLog.version,
            to: logPath,
          };
        }
      );
    },
    stunts(): Stunt[] {
      return this.$store.getters[stuntStore.getters.scannedStunts].map(
        (stunt: Stunt): Timeline => {
          const scanned: ScannedCode | undefined =
            this.$store.getters.hasCodeBeenScanned(stunt.code);

          return {
            icon: stunt.icon,
            title: stunt.name,
            action: "Scanned",
            subtitle: stunt.description.text,
            colour: "red darken-4",
            time: scanned?.time ?? "",
            to: stunt.path,
          };
        }
      );
    },
  },
  async mounted() {
    this.$setBreadcrumbs([{ to: null, label: "Home" }]);
    await this.fetchMyEventLogs();
  },
  methods: {
    async fetchMyEventLogs() {
      this.$set(this.loading, "fetchLogs", true);
      await this.$store.dispatch("fetchMyEventLogs", { syncMode: "diff" });
      this.$set(this.loading, "fetchLogs", false);
    },
  },
};
</script>
