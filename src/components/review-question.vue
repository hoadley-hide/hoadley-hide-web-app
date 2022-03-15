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
            <p class="text--secondary">{{ question.description }}</p>
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
            <p class="text--secondary">
              <v-btn block tile color="green" @click="data = new Date()">
                Now
              </v-btn>
            </p>

            <v-time-picker
              v-model="data"
              format="ampm"
              elevation="2"
              full-width
            ></v-time-picker>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Stunt } from "~/types";
export default {
  props: {
    question: Object,
  },
  data() {
    return { data: "" };
  },
  computed: {
    stuntList() {
      return this.$store.state.stunts
        .map((s) => s) // clone array so the sort does not mutate the array in VueX.
        .sort((a: Stunt, b: Stunt) => a.stuntNumber - b.stuntNumber);
    },
  },
  watch: {
    data() {
      this.$emit("input", this.data);
    },
  },
};
</script>
