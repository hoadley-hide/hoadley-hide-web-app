import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { funnySubStoreAuth } from "~/common/authorisation";
// import { authorised } from "~/common/authorisation";
import { GraphQL, Walkpoint } from "~/types";

export const names = {
  getters: {
    getWalkpoint: "walkpoint/getWalkpoint",
    getWalkpoints: "walkpoint/getWalkpoints",
    scannedWalkpoints: "walkpoint/scannedWalkpoints",
    stats: "walkpoint/stats",
  },
  mutations: {
    setWalkpoints: "walkpoint/setWalkpoints",
  },
  actions: {
    initialise: "walkpoint/initialise",
  },
};

export const state = () => ({
  loadError: null as string | null,
  walkpoints: [] as Walkpoint[],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  getWalkpoint: (state) => (slugOrCodeOrId: string) => {
    return (
      state.walkpoints.find((walkpoint) =>
        [walkpoint.id, walkpoint.slug, walkpoint.code].includes(slugOrCodeOrId)
      ) ?? null
    );
  },
  getWalkpoints: (state, getters, _rootState, rootGetters) => {
    let walkpoints: Walkpoint[] = [];

    if (funnySubStoreAuth(rootGetters, ["walkpoint:seeAll"])) {
      walkpoints = [...state.walkpoints];
    } else {
      walkpoints = getters.scannedWalkpoints;
    }

    return walkpoints
      .filter((walkpoint) => rootGetters.eventDayCheck(walkpoint.eventStageDay))
      .sort((a: Walkpoint, b: Walkpoint) =>
        a.walkpointLetter.localeCompare(b.walkpointLetter)
      );
  },
  scannedWalkpoints: (state, _getters, _rootState, rootGetters) => {
    return state.walkpoints
      .filter((walkpoint) => rootGetters.eventDayCheck(walkpoint.eventStageDay))
      .filter((s) => rootGetters.hasCodeBeenScanned(s.code));
  },
  stats: (state, getters, _rootState, rootGetters) => {
    return {
      total: state.walkpoints.filter((walkpoint) =>
        rootGetters.eventDayCheck(walkpoint.eventStageDay)
      ).length,
      scanned: getters.scannedWalkpoints.length,
    };
  },
};

export const mutations: MutationTree<RootState> = {
  loadError: (state, yes: boolean) => {
    Vue.set(state, "loadError", yes);
  },
  setWalkpoints: (state, walkpoints) => {
    Vue.set(state, "walkpoints", walkpoints);
  },
};

export const actions: ActionTree<RootState, RootState> = {
  async initialise({ commit }) {
    try {
      const result: GraphQL<"walkpoints", Walkpoint[]> = await $fetch(
        "/api/walkpoints"
      );
      if (!result.data) {
        commit("loadError", true);
        return;
      }
      commit("setWalkpoints", result.data.walkpoints);
      commit("loadError", false);
    } catch (e) {
      commit("loadError", true);
    }
  },
};
