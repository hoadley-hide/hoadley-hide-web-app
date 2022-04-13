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
                  v-for="stunt in points"
                  :key="stunt.code"
                  :value="stunt.code"
                >
                  <v-list-item-icon>
                    <v-icon>{{ stunt.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <span>
                      <v-chip small color="red">
                        <span v-if="stunt.stuntNumber">
                          #{{ stunt.stuntNumber }}
                        </span>
                        <span v-if="stunt.walkpointLetter">
                          #{{ stunt.walkpointLetter }}
                        </span>
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
import { Question, Stunt, Walkpoint } from "~/types";
import { isValid } from "~/common/question";
import { dateHelper } from "~/plugins/filters";
import { names as stuntStore } from "~/store/stunt";
import { names as walkpointStore } from "~/store/walkpoint";

export default {
  props: {
    value: { type: [String, Number, Date] },
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
      return !isValid(this.question, this.data);
    },
    stuntList(): Stunt[] {
      return this.$store.getters[stuntStore.getters.getStunts];
    },
    walkpointList(): Walkpoint[] {
      return this.$store.getters[walkpointStore.getters.getWalkpoints];
    },
    points() {
      const Voc: Walkpoint = {
        _type: "walkpoint",
        id: "",
        code: "VOC",
        name: "VOC",
        slug: "",
        path: "",
        icon: "mdi-tent",
        description: { html: "", text: "" },
        eventStageDay: "friday",
        walkpointLetter: "",
        coordinates: {},
      };
      return [Voc].concat(this.stuntList).concat(this.walkpointList);
    },
  },
  watch: {
    value(newValue) {
      const potentialDate = dateHelper(newValue);
      if (typeof potentialDate !== "string") {
        this.data = potentialDate.toJSDate();
        return;
      }
      this.data = newValue;
    },
    data() {
      const question = this.question as Question;

      if (question.questionFieldType === "Time") {
        const potentialDate = dateHelper(this.data);
        if (typeof potentialDate !== "string") {
          this.$emit("input", potentialDate.toISO());

          return;
        }
      }
      this.$emit("input", this.data);

      if (question.questionFieldType === "Rating") {
        this.countOfRatingChanges++;
      }
    },
  },
};
</script>
