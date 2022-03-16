import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { Checkpoint, EventLog, Patrol, Stunt } from "~/types";

export const state = () => ({
  inflightCheckpoints: [] as Checkpoint[],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  getCheckpoint: (state) => (id: string) => {
    return state.inflightCheckpoints.find((c) => c.id === id) ?? null;
  },
  getPartials: (state) => (stunt: Stunt) => {
    return state.inflightCheckpoints.filter(
      (c) => c.recording.code === stunt.code
    );
  },
  getPartial: (state) => (patrol: Patrol, stunt: Stunt) => {
    return (
      state.inflightCheckpoints.find(
        (c) => c.patrol.code === patrol.code && c.recording.code === stunt.code
      ) ?? null
    );
  },
  patrolCheckInStatus:
    (state, getters, rootState, rootGetters) =>
    (patrol: Patrol, stunt: Stunt): "incomplete" | "complete" | "inflight" => {
      if (!rootGetters.user) {
        return "incomplete";
      }

      if (
        state.inflightCheckpoints.some(
          (checkpoint: Checkpoint) =>
            checkpoint.data.type === "checkpoint:stunt:visit" &&
            checkpoint.patrol.id === patrol.id &&
            checkpoint.recording.id === stunt.id
        )
      ) {
        return "inflight";
      }

      if (
        rootState.eventLogs.some(
          (eventLog: EventLog) =>
            eventLog.type === "checkpoint:stunt:visit" &&
            eventLog.recordingEntity?.id === stunt.id &&
            eventLog.referencedEntity?.id === patrol.id
        )
      ) {
        return "complete";
      }
      return "incomplete";
    },
};

export const mutations: MutationTree<RootState> = {
  addInflight: (state, checkpoint: Checkpoint) => {
    const existingIndex = state.inflightCheckpoints.findIndex(
      (c) => c.id === checkpoint.id
    );

    if (existingIndex !== -1) {
      Vue.set(state.inflightCheckpoints, existingIndex, checkpoint);
      return;
    }

    Vue.set(
      state.inflightCheckpoints,
      state.inflightCheckpoints.length,
      checkpoint
    );
  },
  removeInflight: (state, checkpoint: Checkpoint) => {
    const checkpointIndex = state.inflightCheckpoints.findIndex(
      (c) => c.id === checkpoint.id
    );

    if (checkpointIndex === -1) {
      return;
    }

    state.inflightCheckpoints.splice(checkpointIndex, 1);
  },
};

export const actions: ActionTree<RootState, RootState> = {
  async addInflight({ commit }, checkpoint: Checkpoint) {
    commit("addInflight", checkpoint);
    console.log("addInflight");
  },
  async removeInflight({ commit }, checkpoint: Checkpoint) {
    commit("removeInflight", checkpoint);
    console.log("removeInflight");
  },
};
