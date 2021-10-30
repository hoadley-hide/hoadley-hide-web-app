import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { EventStage, GraphQL, Stunt } from "~/types";

export const state = () => ({
  eventStages: [] as EventStage[],
  stunts: [] as Stunt[],
  name: "Me",
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  name: (state) => state.name,
};

export const mutations: MutationTree<RootState> = {
  CHANGE_NAME: (state, newName: string) => (state.name = newName),
};

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ state }) {
      await this.dispatch("initialiseAll");
  },

  async initialiseAll({ state }) {
    await this.dispatch("initialiseStunts");
    await this.dispatch("initialiseEventStages");
  },
  async initialiseStunts({ state }) {
    try {
      const result: GraphQL<"stunts", Stunt> = await $fetch("/api/stunts");
      if (result && result.data) {
        Vue.set(state, "stunts", result.data.stunts);
      }
    } catch (e) {
      const res: GraphQL<"stunts", Stunt> = await e.response.json();
      console.log(res);
      console.log(res.errors);
    }

  },
  async initialiseEventStages({ state }) {
    try {
      const result: GraphQL<"eventStages", EventStage> = await $fetch("/api/event-stages");
      if (result && result.data) {
        Vue.set(state, "eventStages", result.data.eventStages);
      }
    } catch (e) {
      const res: GraphQL<"eventStages", EventStage> = await e.response.json();
      console.log(res);
      console.log(res.errors);
    }

  },
};
