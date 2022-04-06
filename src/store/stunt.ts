import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { funnySubStoreAuth } from "~/common/authorisation";
// import { authorised } from "~/common/authorisation";
import { GraphQL, Stunt } from "~/types";

export const names = {
  getters: {
    getStunt: "stunt/getStunt",
    getStunts: "stunt/getStunts",
    scannedStunts: "stunt/scannedStunts",
  },
  mutations: {
    setStunts: "stunt/setStunts",
  },
  actions: {
    initialise: "stunt/initialise",
  },
};

export const state = () => ({
  loadError: null as string | null,
  stunts: [] as Stunt[],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  getStunt: (state) => (slugOrCodeOrId: string) => {
    return (
      state.stunts.find((stunt) =>
        [stunt.id, stunt.slug, stunt.code].includes(slugOrCodeOrId)
      ) ?? null
    );
  },
  getStunts: (state, getters, _rootState, rootGetters) => {
    let stunts: Stunt[] = [];

    if (funnySubStoreAuth(rootGetters, ["stunt:seeAll"])) {
      stunts = [...state.stunts];
    } else {
      stunts = getters.scannedStunts;
    }

    return stunts.sort((a: Stunt, b: Stunt) => a.stuntNumber - b.stuntNumber);
  },
  scannedStunts: (state, _getters, _rootState, rootGetters) => {
    return state.stunts.filter((s) => rootGetters.hasCodeBeenScanned(s.code));
  },
};

export const mutations: MutationTree<RootState> = {
  loadError: (state, yes: boolean) => {
    Vue.set(state, "loadError", yes);
  },
  setStunts: (state, stunts) => {
    Vue.set(state, "stunts", stunts);
  },
};

export const actions: ActionTree<RootState, RootState> = {
  async initialise({ commit }) {
    try {
      const result: GraphQL<"stunts", Stunt[]> = await $fetch("/api/stunts");
      if (!result.data) {
        commit("loadError", true);
        return;
      }
      commit("setStunts", result.data.stunts);
      commit("loadError", false);
    } catch (e) {
      commit("loadError", true);
    }
  },
};
