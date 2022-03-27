import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { funnySubStoreAuth } from "~/common/authorisation";
// import { authorised } from "~/common/authorisation";
import { GraphQL, Patrol } from "~/types";

export const names = {
  getters: {
    getPatrol: "patrol/getPatrol",
    getPatrols: "patrol/getPatrols",
  },
  mutations: {
    setPatrols: "patrol/setPatrols",
  },
  actions: {
    initialise: "patrol/initialise",
  },
};

export const state = () => ({
  loadError: null as string | null,
  patrols: [] as Patrol[],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  getPatrol: (state) => (slugOrCodeOrId: string) => {
    return (
      state.patrols.find((patrol) =>
        [patrol.id, patrol.slug, patrol.code].includes(slugOrCodeOrId)
      ) ?? null
    );
  },
  getPatrols: (state, _getters, _rootState, rootGetters) => {
    let patrols: Patrol[] = [];

    if (funnySubStoreAuth(rootGetters, ["patrol:seeAll"])) {
      patrols = [...state.patrols];
    } else {
      patrols = state.patrols.filter((s) =>
        rootGetters.hasCodeBeenScanned(s.code)
      );
    }

    return patrols.sort(
      (a: Patrol, b: Patrol) => a.patrolNumber - b.patrolNumber
    );
  },
};

export const mutations: MutationTree<RootState> = {
  loadError: (state, yes: boolean) => {
    Vue.set(state, "loadError", yes);
  },
  setPatrols: (state, patrols) => {
    Vue.set(state, "patrols", patrols);
  },
};

export const actions: ActionTree<RootState, RootState> = {
  async initialise({ commit }) {
    try {
      const result: GraphQL<"patrols", Patrol[]> = await $fetch("/api/patrols");
      if (!result.data) {
        commit("loadError", true);
        return;
      }
      commit("setPatrols", result.data.patrols);
      commit("loadError", false);
    } catch (e) {
      commit("loadError", true);
    }
  },
};
