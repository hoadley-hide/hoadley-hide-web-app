import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { funnySubStoreAuth } from "~/common/authorisation";
import { GraphQL, EventLog, EventLogAugmented } from "~/types";

export const names = {
  getters: {
    // getEventLog: "event-log/getEventLog",
    // getEventLogs: "event-log/getEventLogs",
    getCheckpoints: "event-log/getCheckpoints",
    getReviews: "event-log/getReviews",
  },
  mutations: {
    // setEventLogs: "event-log/setEventLogs",
  },
  actions: {
    // initialise: "event-log/initialise",
  },
};

export const state = () => ({
  loadError: null as string | null,
  eventLogs: [] as EventLog[],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  // getEventLog: (state) => (slugOrCodeOrId: string) => {
  //   return (
  //     state.eventLog.find((stunt) =>
  //       [stunt.id, stunt.slug, stunt.code].includes(slugOrCodeOrId)
  //     ) ?? null
  //   );
  // },
  // getEventLogs: (state, getters, _rootState, rootGetters) => {
  //   let eventLog: EventLog[] = [];

  //   if (funnySubStoreAuth(rootGetters, ["??:seeAll"])) {
  //     eventLog = [...state.eventLogs];
  //   } else {
  //     eventLog = getters.scannedEventLogs;
  //   }

  //   return eventLog.sort(
  //     (a: EventLog, b: EventLog) => a.stuntNumber - b.stuntNumber
  //   );
  // },
  getReviews: (state, getters, rootState, rootGetters): EventLogAugmented[] => {
    let logs: EventLog[] = rootState.eventLogs.filter(
      (eventLog) => eventLog.type === "review:stunt"
    );

    const user = rootGetters.user;

    if (!user) {
      logs = [];
    } else if (!funnySubStoreAuth(rootGetters, ["review:seeOthers"])) {
      logs = logs.filter(
        (eventLog) =>
          eventLog.referencedEntity?.id === user.id ||
          eventLog.recordingEntity?.id === user.id
      );
    }

    return logs.map(
      (log): EventLogAugmented => ({
        deduplicationId: log.deduplicationId,
        version: log.version,
        hash: log.hash,
        eventName: log.eventName,
        type: log.type,
        recordingEntity: log.recordingEntity
          ? getters.findById(log.recordingEntity.id)
          : null,
        referencedEntity: log.referencedEntity
          ? getters.findById(log.referencedEntity.id)
          : null,
        data: log.data,
        isPersisted: !rootState.pendingLogIds.includes(log.deduplicationId),
      })
    );
  },
  getCheckpoints: (_state, _getters, rootState, rootGetters) => {
    let logs = rootState.eventLogs.filter((eventLog) =>
      [
        "checkpoint:stunt:visit",
        "checkpoint:voc:enter",
        "checkpoint:voc:exit",
        "checkpoint:walkpoint:collect",
      ].includes(eventLog.type)
    );

    const user = rootGetters.user;

    if (!user) {
      logs = [];
    } else if (!funnySubStoreAuth(rootGetters, ["checkpoint:seeOthers"])) {
      logs = logs.filter(
        (eventLog) =>
          eventLog.referencedEntity?.id === user.id ||
          eventLog.recordingEntity?.id === user.id
      );
    }

    return logs.map(
      (log): EventLogAugmented => ({
        deduplicationId: log.deduplicationId,
        version: log.version,
        hash: log.hash,
        eventName: log.eventName,
        type: log.type,
        recordingEntity: log.recordingEntity
          ? rootGetters.findById(log.recordingEntity.id)
          : null,
        referencedEntity: log.referencedEntity
          ? rootGetters.findById(log.referencedEntity.id)
          : null,
        data: log.data,
        isPersisted: !rootState.pendingLogIds.includes(log.deduplicationId),
      })
    );
  },
};

export const mutations: MutationTree<RootState> = {
  // loadError: (state, yes: boolean) => {
  //   Vue.set(state, "loadError", yes);
  // },
  // setEventLogs: (state, eventLog) => {
  //   Vue.set(state, "eventLog", eventLog);
  // },
};

export const actions: ActionTree<RootState, RootState> = {
  // async initialise({ commit }) {
  //   try {
  //     const result: GraphQL<"eventLog", EventLog[]> = await $fetch(
  //       "/api/eventLog"
  //     );
  //     if (!result.data) {
  //       commit("loadError", true);
  //       return;
  //     }
  //     commit("setEventLogs", result.data.eventLog);
  //     commit("loadError", false);
  //   } catch (e) {
  //     commit("loadError", true);
  //   }
  // },
};
