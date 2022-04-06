import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { funnySubStoreAuth } from "~/common/authorisation";
import { GraphQL, Patrol, PatrolInput } from "~/types";

export const names = {
  getters: {
    getPatrol: "patrol/getPatrol",
    getPatrols: "patrol/getPatrols",
    scannedPatrols: "patrol/scannedPatrols",
  },
  mutations: {
    setPatrols: "patrol/setPatrols",
  },
  actions: {
    initialise: "patrol/initialise",
    upsertPatrol: "patrol/upsertPatrol",
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
        [patrol.id, patrol.slug, patrol.code, patrol.patrolNumber].includes(
          slugOrCodeOrId
        )
      ) ?? null
    );
  },
  getPatrols: (state, getters, _rootState, rootGetters) => {
    let patrols: Patrol[] = [];

    if (funnySubStoreAuth(rootGetters, ["patrol:seeAll"])) {
      patrols = [...state.patrols];
    } else {
      patrols = getters.scannedPatrols;
    }

    return patrols.sort(
      (a: Patrol, b: Patrol) => Number(a.patrolNumber) - Number(b.patrolNumber)
    );
  },
  scannedPatrols: (state, _getters, _rootState, rootGetters) => {
    return state.patrols.filter((p) => rootGetters.hasCodeBeenScanned(p.code));
  },
};

export const mutations: MutationTree<RootState> = {
  loadError: (state, yes: boolean) => {
    Vue.set(state, "loadError", yes);
  },
  setPatrol: (state, patrol: Patrol) => {
    const existingIndex = state.patrols.findIndex((e) => e.id === patrol.id);
    if (existingIndex) {
      return Vue.set(state.patrols, existingIndex, patrol);
    }
    Vue.set(state.patrols, state.patrols.length, patrol);
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
  async upsertPatrol({ commit }, patrolData: PatrolInput) {
    try {
      const result: GraphQL<"patrol", Patrol> = await $fetch("/api/patrols", {
        method: "POST",
        body: patrolData,
      });
      if (!result.data) {
        await this.$createAlert({
          heading: `Failed to update ${patrolData.patrolNumber}`,
          message: result.errors?.map((e) => e.message).join(", "),
          type: "error",
        });
        commit("loadError", true);
        return;
      }
      commit("setPatrol", result.data.patrol);
      commit("loadError", false);
    } catch (e) {
      await this.$createAlert({
        heading: `Failed to update patrol ${patrolData.patrolNumber}`,
        message: e,
        type: "error",
      });
      commit("loadError", true);
    }
  },
};
