<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Dashboard</v-card-title>

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
    <v-col cols="12">
      <v-card>
        <!-- <v-card-title>Patrols visiting Stunts</v-card-title>
        <v-card-subtitle># of stunts visited by patrols</v-card-subtitle> -->
        <v-card-title>Patrol scoring</v-card-title>
        <v-card-subtitle>Scores by area (average)</v-card-subtitle>
        <v-card-text>
          <v-sparkline
            :value="chartData.values"
            :labels="chartData.labels"
            smooth="2"
            padding="16"
            line-width="2"
            stroke-linecap="round"
            type="trend"
            auto-draw
          >
          </v-sparkline>
        </v-card-text>
        <v-data-table
          :headers="tableData.headings"
          :items="tableData.items"
          :items-per-page="999"
          item-key="deduplicationId"
          v-model="selectedCheckpoints"
          show-select
        >
        </v-data-table>
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
import { EventLog, EventLogAugmented, Question } from "~/types";

type TableDataRow = Record<string, string | number>;
const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
export default {
  data() {
    return {
      loading: {},
      selectedCheckpoints: [] as TableDataRow[],
    };
  },
  computed: {
    checkpoints(): EventLogAugmented[] {
      if (!this.$useUser()) {
        return [];
      }

      if (this.$auth(["patrol:canCheckpoint:stunt:visit"])) {
        return this.$store.getters.checkpointStuntVisit;
      }

      return [];
    },
    questions(): Question[] {
      if (!this.$useUser()) {
        return [];
      }

      return this.$store.getters.checkpointStuntVisitQuestions;
    },
    shouldShow() {
      return (checkpoint: EventLogAugmented): boolean => {
        if (this.selectedCheckpoints.length === 0) {
          return true;
        }
        const isSelected = this.selectedCheckpoints.find(
          (selected) => selected.code === checkpoint.referencedEntity?.code
        );
        return !!isSelected;
      };
    },
    chartData() {
      const chartData: Record<string, number[]> = {};

      for (const checkpoint of this.checkpoints) {
        if (!checkpoint.referencedEntity) {
          continue;
        }

        if (!this.shouldShow(checkpoint)) {
          continue;
        }

        for (const question of this.questions) {
          if (question.storageKey === "previous-stunt")
            console.log(
              "Number.isInteger(checkpoint.data[question.storageKey])",
              question.storageKey,
              checkpoint.data[question.storageKey],
              Number.isInteger(checkpoint.data[question.storageKey])
            );

          if (!Number.isInteger(checkpoint.data[question.storageKey])) {
            continue;
          }

          chartData[question.storageKey] = chartData[question.storageKey] ?? [];
          chartData[question.storageKey].push(
            checkpoint.data[question.storageKey]
          );
        }
      }

      return {
        values: Object.values(chartData).map((arrayToAverage) =>
          average(arrayToAverage)
        ),
        labels: Object.keys(chartData).map(
          (storageKey) =>
            this.questions.find((q) => q.storageKey === storageKey)?.heading
        ),
      };
    },
    tableData() {
      // const tableData: Record<string, number>[] = []

      // tableData.push()
      const data: TableDataRow[] = this.checkpoints.map(
        (checkpoint: EventLogAugmented): TableDataRow => {
          return {
            deduplicationId: checkpoint.deduplicationId,
            code: checkpoint.referencedEntity.code,
            name: checkpoint.referencedEntity.name,
            ...checkpoint.data,
          };
        }
      );

      return {
        items: data,
        headings:
          data.length === 0
            ? []
            : Object.keys(data[0])
                .filter((c) => c !== "deduplicationId")
                .map((column) => ({
                  text: this.$options.filters?.capitalize(
                    column.replace(/-/g, " ")
                  ),
                  value: column,
                })),
      };
    },
  },
  async mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: null, label: "Dashboard" },
    ]);

    await this.fetchMyEventLogs();
  },
  methods: {
    async fetchMyEventLogs() {
      this.$set(this.loading, "fetchLogs", true);
      await this.$store.dispatch("fetchMyEventLogs", { syncMode: "diff" });
      this.$set(this.loading, "fetchLogs", false);
    },
    // async handleDelete(review: EventLog) {
    //   if (this.loading[review.deduplicationId]) {
    //     return;
    //   }
    //   this.loading[review.deduplicationId] = true;
    //   await this.$store.dispatch("deleteEventLog", review);
    //   this.loading[review.deduplicationId] = false;
    // },
  },
};
</script>
