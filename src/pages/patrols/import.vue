<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h2">Import Patrols</v-card-title>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" v-show="$useUser((u) => u._type === 'admin')">
      <v-card>
        <v-card-text>
          <v-textarea
            v-model="importData"
            outlined
            :rules="validationRules"
          ></v-textarea>
          <v-btn
            block
            outlined
            @click="importPatrols()"
            :disabled="selectedPatrols.length === 0"
          >
            Import Patrols
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-data-table
        v-model="selectedPatrols"
        :headers="headers"
        :items="groupPatrolData"
        item-key="patrolNumber"
        show-select
        disable-filtering
        disable-pagination
        disable-sort
        hide-default-footer
        :items-per-page="groupPatrolData.length"
      >
        <template v-slot:item.status="{ item }">
          <v-progress-circular
            v-if="currentlyPersitingPatrol === item.patrolNumber"
            indeterminate
          ></v-progress-circular>
          <v-chip v-else-if="existingPatrol(item.patrolNumber)">Exists</v-chip>
        </template>
        <template v-slot:item.importname="{ item }">
          <chip-patrol :patrol="item"></chip-patrol>
        </template>
        <template v-slot:item.existingname="{ item }">
          <div v-if="existingPatrol(item.patrolNumber)">
            <chip-patrol
              :patrol="existingPatrol(item.patrolNumber)"
            ></chip-patrol>
          </div>
        </template>
        <template v-slot:item.importmembers="{ item }">
          <div v-for="member in item.members" class="text-truncate">
            {{ member.fullname }}
            <span class="text--secondary">({{ member.formation }})</span>
          </div>
        </template>
        <template v-slot:item.existingmembers="{ item }">
          <div v-if="existingPatrol(item.patrolNumber)">
            <div
              v-for="member in existingPatrol(item.patrolNumber).members"
              class="text-truncate"
            >
              {{ member.fullname }}
              <span class="text--secondary">({{ member.formation }})</span>
            </div>
          </div>
        </template>
      </v-data-table>
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
import { Patrol, PatrolInput } from "~/types";
import { names as patrol } from "~/store/patrol";

interface ImportData {
  patrolNumber: string;
  patrolName: string;
  memberName: string;
  memberUnit: string;
}

export default {
  data() {
    return {
      importData: "patrolNumber,patrolName,memberName,memberUnit",
      validImportData: [] as ImportData[],
      selectedPatrols: [],
      currentlyPersitingPatrol: null,
      validationRules: [
        (v) => !!v || "Import CSV data is required",
        (v) => this.isDataValid(),
      ],
      headers: [
        { text: "Status", value: "status" },
        { text: "Import Patrol", value: "importname" },
        { text: "Existing Patrol", value: "existingname" },
        { text: "Import Members", value: "importmembers" },
        { text: "Existing Members", value: "existingmembers" },
      ],
    };
  },

  mounted() {
    this.$setBreadcrumbs([
      { to: "/", label: "Home" },
      { to: "/patrols", label: "Patrols" },
      { to: null, label: "Import" },
    ]);
  },
  computed: {
    existingPatrol() {
      return (patrolNumber) =>
        this.$store.getters[patrol.getters.getPatrol](patrolNumber);
    },
    groupPatrolData(): PatrolInput[] {
      if (!this.validImportData) {
        return [];
      }

      const patrols: Record<string, PatrolInput> = {};

      for (const datum of this.validImportData) {
        patrols[datum.patrolNumber] = patrols[datum.patrolNumber] ?? {
          _type: "patrol",
          name: datum.patrolName,
          patrolNumber: datum.patrolNumber,
          members: [],
        };
        patrols[datum.patrolNumber].members.push({
          rego: undefined,
          fullname: datum.memberName,
          formation: datum.memberUnit,
        });
      }
      return Object.values(patrols).map((p) => {
        p.members = p.members.sort((a, b) =>
          a.fullname.localeCompare(b.fullname)
        );
        return p;
      });
    },
  },
  methods: {
    async importPatrols() {
      for (const patrolData of this.selectedPatrols) {
        this.currentlyPersitingPatrol = patrolData.patrolNumber;
        await this.$store.dispatch(patrol.actions.upsertPatrol, patrolData);
        this.currentlyPersitingPatrol = null;

        this.selectedPatrols.splice(
          this.selectedPatrols.indexOf(patrolData),
          1
        );
      }
    },
    isDataValid() {
      try {
        const data = this.parseCSV(this.importData, true);

        if (data.length === 0) {
          return "CSV Required";
        }

        const requiredKeys = [
          "patrolNumber",
          "patrolName",
          "memberName",
          "memberUnit",
        ];
        const missingKeys = requiredKeys.filter(
          (key) => !Object.keys(data[0]).includes(key)
        );
        if (missingKeys.length > 0) {
          return "Data missing headers " + missingKeys.join(", ");
        }

        this.validImportData = data;
        return true;
      } catch (e) {
        return e;
      }
      return "Import CSV data is not valid";
    },
    parseCSV(str, firstRowHeaders: boolean) {
      var arr: string[][] = [];
      var quote = false; // 'true' means we're inside a quoted field

      // Iterate over each character, keep track of current row and column (of the returned array)
      for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c],
          nc = str[c + 1]; // Current character, next character
        arr[row] = arr[row] || []; // Create a new row if necessary
        arr[row][col] = arr[row][col] || ""; // Create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') {
          arr[row][col] += cc;
          ++c;
          continue;
        }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') {
          quote = !quote;
          continue;
        }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == "," && !quote) {
          ++col;
          continue;
        }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == "\r" && nc == "\n" && !quote) {
          ++row;
          col = 0;
          ++c;
          continue;
        }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == "\n" && !quote) {
          ++row;
          col = 0;
          continue;
        }
        if (cc == "\r" && !quote) {
          ++row;
          col = 0;
          continue;
        }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
      }

      if (firstRowHeaders) {
        const headerRow = arr.shift();
        if (!headerRow) {
          return [];
        }

        return arr
          .filter((row) => row.length === headerRow.length)
          .map((row) =>
            headerRow.reduce((acc, k, i) => ((acc[k] = row[i]), acc), {})
          );
      }
      return arr;
    },
  },
};
</script>
