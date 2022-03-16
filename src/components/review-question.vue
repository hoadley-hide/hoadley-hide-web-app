<template>
  <v-card>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card-title>{{ question.heading }}</v-card-title>
        <v-card-subtitle class="text--secondary">
          {{ question.description }}
        </v-card-subtitle>
      </v-col>

      <v-col :cols="question.questionFieldType === 'VerticalRating' ? 6 : 12">
        <v-card-text>
          <v-slider
            v-if="question.questionFieldType === 'VerticalRating'"
            v-model="data"
            min="1"
            :max="question.tickLabels.length"
            step="1"
            vertical
            :tick-labels="question.tickLabels"
            ticks="always"
            tick-size="4"
          ></v-slider>

          <v-slider
            v-if="question.questionFieldType === 'Rating'"
            v-model="data"
            min="1"
            :max="question.tickLabels.length"
            step="1"
            :tick-labels="question.tickLabels"
            ticks="always"
          ></v-slider>

          <v-text-field
            v-else-if="question.questionFieldType === 'ShortAnswer'"
            v-model="data"
          ></v-text-field>

          <v-textarea
            v-else-if="question.questionFieldType === 'LongAnswer'"
            v-model="data"
            :placeholder="question.description"
            outlined
            counter
          ></v-textarea>

          <div v-else-if="question.questionFieldType === 'StuntPicker'">
            <v-list dense>
              <v-list-item-group v-model="data" active-class="green--text">
                <v-list-item
                  v-for="stunt in stuntList"
                  :key="stunt.code"
                  :value="stunt.code"
                >
                  <v-list-item-icon>
                    <v-icon>{{ stunt.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <span>
                      <v-chip small color="red">
                        #{{ stunt.stuntNumber }}
                      </v-chip>
                      {{ stunt.name }}
                    </span>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>

          <div v-else-if="question.questionFieldType === 'Time'">
            <v-row class="text-body-1" align="center">
              <v-col>Selected Time: </v-col>
              <v-col class="d-flex flex-column text-right font-weight-bold">
                <span>{{ data | datetime }}</span>
                <span>{{ data | duration }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn block tile color="green" @click="data = new Date()">
                  Now
                </v-btn>
              </v-col>
              <v-col>
                <v-dialog v-model="timeDialogModel" persistent width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn block tile color="info" v-bind="attrs" v-on="on">
                      Select Time
                    </v-btn>
                  </template>
                  <v-time-picker
                    v-if="timeDialogModel"
                    v-model="data"
                    format="ampm"
                    full-width
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="success"
                      @click="timeDialogModel = false"
                    >
                      Close &amp; Save
                    </v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-col>

      <v-col cols="12" v-if="hasError">
        <v-card-text>
          <v-alert type="warning" outlined dense>
            This response is required.
          </v-alert>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Stunt } from "~/types";
import { dateHelper } from "~/plugins/filters";
export default {
  props: {
    question: Object,
  },
  data() {
    return {
      data: "",
      timeDialogModel: false,
      countOfRatingChanges: 0,
    };
  },
  computed: {
    hasError() {
      if (this.question.questionFieldType === "Time") {
        return typeof dateHelper(this.data) === "string";
      } else if (this.question.questionFieldType === "StuntPicker") {
        return !this.data;
      } else if (this.question.questionFieldType === "StuntPicker") {
        return !this.data;
      } else if (this.question.questionFieldType === "ShortAnswer") {
        return !this.data;
      } else if (this.question.questionFieldType === "Rating") {
        return this.countOfRatingChanges < 3 && this.data <= 1;
      }
    },
    stuntList() {
      return this.$store.state.stunts
        .map((s) => s) // clone array so the sort does not mutate the array in VueX.
        .sort((a: Stunt, b: Stunt) => a.stuntNumber - b.stuntNumber);
    },
  },
  watch: {
    data() {
      this.$emit("input", this.data);

      if (this.question.questionFieldType === "Rating") {
        this.countOfRatingChanges++;
      }
    },
  },
};
</script>
