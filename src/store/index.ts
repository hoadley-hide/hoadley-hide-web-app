import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { AppAlert } from "~/common/alert";
import { AppBreadcrumb } from "~/common/breadcrumb";
import {
  AppUserEntity,
  Entity,
  EventLog,
  EventLogAugmented,
  EventStage,
  GraphQL,
  MonstemonGo,
  Patrol,
  ReviewQuestion,
  ScannedCode,
  Stunt,
  WikiArticle,
} from "~/types";

export const state = () => ({
  // UI
  alerts: [] as AppAlert[],
  breadcrumbs: [] as AppBreadcrumb[],
  // Entities
  admins: [] as EventStage[],
  eventStages: [] as EventStage[],
  monstemonGos: [] as EventStage[],
  patrols: [] as Patrol[],
  reviewQuestions: [] as ReviewQuestion[],
  stunts: [] as Stunt[],
  wikiArticles: [] as WikiArticle[],
  // Other Stuff
  scannedCodes: [] as Entity[],
  monsterAcronyms: [
    "Military Operational New Soldiers Trapped till Everybody Runs",
    "Many Oodles of Nutty Stories Threatening Earth's Reality",
    "Martian Orbital Nuclear Spaceship for Terraforming into Earthlike Realm",
    "Mostly Online New System for Terrible Electronic Rucksacks",
    "Mining Operation for Nice Shiny Tiny Earth Rocks",
    "Monsters Official Network of Safe Tourist Extracurricular Reprieves",
    "Masters On News Station Timings Elmore Region",
    "Mystic Oranges Never Stay to Enlighten Royals",
  ],
  hasPermissionWarningBeenRead: false as boolean,
  user: null as AppUserEntity | null,
  eventLogs: [] as EventLog[],
  pendingLogIds: [] as string[],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  // Util getters
  alerts: (state) => state.alerts,
  breadcrumbs: (state) => state.breadcrumbs,
  scannedCodes: (state) => state.scannedCodes,
  hasCodeBeenScanned:
    (state) =>
    (code): ScannedCode | undefined => {
      return state.scannedCodes.find((scanned) => scanned.code === code);
    },
  // Content getters
  admin: (state) => (slugOrId) =>
    state.admins.find(
      (admin) => admin.slug === slugOrId || admin.code === slugOrId
    ),
  eventStage: (state) => (slugOrId) =>
    state.eventStages.find(
      (stage) => stage.slug === slugOrId || stage.code === slugOrId
    ),
  monstemonGo: (state) => (slugOrId) =>
    state.monstemonGos.find(
      (monstemonGo) =>
        monstemonGo.slug === slugOrId || monstemonGo.code === slugOrId
    ),
  patrol: (state) => (slugOrId) =>
    state.patrols.find(
      (patrol) => patrol.slug === slugOrId || patrol.code === slugOrId
    ),
  stunt: (state) => (slugOrId) =>
    state.stunts.find(
      (stunt) => stunt.slug === slugOrId || stunt.code === slugOrId
    ),
  wikiArticle: (state) => (slugOrId) =>
    state.wikiArticles.find(
      (wikiArticle) =>
        wikiArticle.slug === slugOrId || wikiArticle.code === slugOrId
    ),
  // User getters
  user: (state, getters): AppUserEntity | null => {
    if (!state.user) {
      return null;
    }

    const entity: AppUserEntity = getters.compiledCodes.find(
      (entity: AppUserEntity) => entity.code === state.user?.code
    );

    return entity ?? null;
  },
  activeEventStage: (state, getters) => {
    const activeStages = state.eventStages
      .filter((stage: EventStage) => {
        const stageAlwaysShown =
          stage.autoShowAfterStartTime &&
          Date.parse(stage.startTime) < Date.now();

        const codeScanned = getters.hasCodeBeenScanned(stage.code);
        return codeScanned || stageAlwaysShown;
      })
      .sort((a: EventStage, b: EventStage) => {
        return Date.parse(a.startTime) - Date.parse(b.startTime);
      });
    return activeStages[activeStages.length - 1];
  },
  // QR Codes
  compiledCodes: (state) => {
    const compiledCodes: Entity[] = [
      ...state.admins,
      ...state.eventStages,
      ...state.monstemonGos,
      ...state.patrols,
      ...state.stunts,
      ...state.wikiArticles,
    ];

    return compiledCodes;
  },
  findById:
    (state) =>
    (id: string): Entity | null => {
      const compiledCodes: Entity[] = [
        ...state.admins,
        ...state.eventStages,
        ...state.monstemonGos,
        ...state.patrols,
        ...state.stunts,
        ...state.wikiArticles,
      ];

      return compiledCodes.find((entity) => entity.id === id) ?? null;
    },
  stuntReviewCompleted:
    (state, getters) =>
    (stunt: Stunt): boolean => {
      if (!getters.user) {
        return false;
      }

      console.log(state.eventLogs);

      return state.eventLogs.some(
        (eventLog) =>
          eventLog.type === "review:stunt" &&
          eventLog.recordingEntity.id === getters.user?.id &&
          eventLog.referencedEntity.id === stunt.id
      );
    },
  reviewsRecordedBySelf: (state, getters): EventLogAugmented[] => {
    if (!state.user) {
      return [];
    }

    const logs: EventLog[] = state.eventLogs.filter(
      (eventLog) =>
        eventLog.type === "review:stunt" &&
        eventLog.recordingEntity.id === state.user?.id
    );

    return logs.map(
      (log): EventLogAugmented => ({
        deduplicationId: log.deduplicationId,
        eventName: log.eventName,
        type: log.type,
        recordingEntity: getters.findById(log.recordingEntity.id),
        referencedEntity: getters.findById(log.referencedEntity.id),
        data: log.data,
        isPersisted: !state.pendingLogIds.includes(log.deduplicationId),
      })
    );
  },
  reviewsReferencingSelf: (state, getters): EventLogAugmented[] => {
    if (!state.user) {
      return [];
    }

    const logs: EventLog[] = state.eventLogs.filter(
      (eventLog) =>
        eventLog.type === "review:stunt" &&
        eventLog.referencedEntity.id === state.user?.id
    );

    return logs.map(
      (log): EventLogAugmented => ({
        deduplicationId: log.deduplicationId,
        eventName: log.eventName,
        type: log.type,
        recordingEntity: getters.findById(log.recordingEntity.id),
        referencedEntity: getters.findById(log.referencedEntity.id),
        data: log.data,
        isPersisted: !state.pendingLogIds.includes(log.deduplicationId),
      })
    );
  },
};

export const mutations: MutationTree<RootState> = {
  addAlert: (state, appAlert: AppAlert) => {
    Vue.set(state.alerts, state.alerts.length, appAlert);
  },
  removeAlert: (state, appAlert: AppAlert) => {
    state.alerts.splice(state.alerts.indexOf(appAlert), 1);
  },
  setBreadcrumbs: (state, breadcrumbs: AppBreadcrumb[]) => {
    Vue.set(state, "breadcrumbs", breadcrumbs);
  },
  permissionWarningHasBeenRead: (state) => {
    Vue.set(state, "hasPermissionWarningBeenRead", true);
  },
  recordCodeScan: (state, entity: Entity) => {
    Vue.set(state.scannedCodes, state.scannedCodes.length, {
      time: new Date(),
      code: entity.code,
    });
  },
  clearScannedCodes: (state) => {
    Vue.set(state, "scannedCodes", []);
  },
  resetApp: (state) => {
    Vue.set(state, "user", null);
    Vue.set(state, "scannedCodes", []);
    Vue.set(state, "hasPermissionWarningBeenRead", false);
  },
  // Entities
  setAdmins: (state, admins) => {
    Vue.set(state, "admins", admins);
  },
  setEventStages: (state, eventStages) => {
    Vue.set(state, "eventStages", eventStages);
  },
  setMonstemonGos: (state, monstemonGos) => {
    Vue.set(state, "monstemonGos", monstemonGos);
  },
  setPatrols: (state, patrols) => {
    Vue.set(state, "patrols", patrols);
  },
  setReviewQuestions: (state, reviewQuestions) => {
    Vue.set(state, "reviewQuestions", reviewQuestions);
  },
  setStunts: (state, stunts) => {
    Vue.set(state, "stunts", stunts);
  },
  setWikiArticles: (state, wikiArticles) => {
    Vue.set(state, "wikiArticles", wikiArticles);
  },
  // User
  persistUser: (state, entity: AppUserEntity) => {
    Vue.set(state, "user", entity);
  },
  addEventLogRequest: (state, logData: EventLog) => {
    // Record dedup id as pending.
    Vue.set(
      state.pendingLogIds,
      state.pendingLogIds.length,
      logData.deduplicationId
    );
    // Record log dataset for immediate use in app.
    Vue.set(state.eventLogs, state.eventLogs.length, logData);
  },
  recordEventLogPersist: (state, opt: { deduplicationId: string }) => {
    // Remove dedup id from the pending list.
    state.pendingLogIds.splice(
      state.pendingLogIds.indexOf(opt.deduplicationId),
      1
    );
  },
};

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ dispatch }) {
    await dispatch("initialiseAll");
  },
  async addAlert({ commit, dispatch, getters }, appAlert: AppAlert) {
    const duplicateAlert = getters.alerts.find((alert: AppAlert) =>
      alert.equals(appAlert)
    );

    const alert: AppAlert = duplicateAlert ? duplicateAlert : appAlert;

    alert.setTimeout((alert) => {
      dispatch(`expireAlert`, alert);
    }, 5000);

    if (appAlert.deduplicate && duplicateAlert) {
      // Deduplication is enabled & the alert is a duplicate.
      // Don't add a new alert.
      return;
    }

    commit("addAlert", alert);
  },
  async expireAlert({ commit }, appAlert: AppAlert) {
    commit("removeAlert", appAlert);
  },
  async setBreadcrumbs({ commit }, breadcrumbs: AppBreadcrumb[]) {
    commit("setBreadcrumbs", breadcrumbs);
  },

  async initialiseAll({ dispatch }) {
    await dispatch("initialiseEntity", {
      path: "/api/admins",
      dataKey: "admins",
      mutation: "setAdmins",
    });
    await dispatch("initialiseEntity", {
      path: "/api/event-stages",
      dataKey: "eventStages",
      mutation: "setEventStages",
    });
    await dispatch("initialiseEntity", {
      path: "/api/monstemon-go",
      dataKey: "monstemonGos",
      mutation: "setMonstemonGos",
    });
    await dispatch("initialiseEntity", {
      path: "/api/patrols",
      dataKey: "patrols",
      mutation: "setPatrols",
    });
    await dispatch("initialiseEntity", {
      path: "/api/review-questions",
      dataKey: "reviewQuestions",
      mutation: "setReviewQuestions",
    });
    await dispatch("initialiseEntity", {
      path: "/api/stunts",
      dataKey: "stunts",
      mutation: "setStunts",
    });
    await dispatch("initialiseEntity", {
      path: "/api/wiki-articles",
      dataKey: "wikiArticles",
      mutation: "setWikiArticles",
    });
  },
  async initialiseEntity({ commit }, { path, dataKey, mutation }) {
    type ResultType = GraphQL<
      string,
      Stunt | EventStage | Patrol | WikiArticle | MonstemonGo
    >;

    try {
      const result: ResultType = await $fetch(path);
      if (result && result.data) {
        commit(mutation, result.data[dataKey]);
      }
    } catch (e) {
      throw e;
      // const res: ResultType = await (e as any).response;
      // console.log(res);
      // console.log(res.errors);
    }
  },

  async validateCode({ getters }, code: string) {
    if (!code) {
      return null;
    }

    const matchedCode = getters.compiledCodes.find((route) => {
      return route.code === code.toUpperCase();
    });

    return matchedCode || null;
  },

  async recordCodeScan({ commit }, lookup: Entity) {
    commit("recordCodeScan", lookup);
  },
  async clearScannedCodes({ commit }) {
    commit("clearScannedCodes");
  },

  async resetApp({ commit }) {
    commit("resetApp");
  },

  async persistUser(
    { commit, getters },
    opts: { adminId: string } | { patrolId: string } | { stuntId: string }
  ) {
    if ("adminId" in opts) {
      commit("persistUser", getters.admin(opts.adminId));
    } else if ("patrolId" in opts) {
      commit("persistUser", getters.patrol(opts.patrolId));
    } else if ("stuntId" in opts) {
      commit("persistUser", getters.stunt(opts.stuntId));
    }
  },

  async persistEventLog({ commit }, logData: EventLog) {
    commit("addEventLogRequest", logData);

    try {
      const res = await $fetch("/api/log", {
        method: "POST",
        body: logData,
      });

      console.log(res);
      commit("recordEventLogPersist", {
        deduplicationId: logData.deduplicationId,
      });
    } catch (e) {
      console.log(e);
    }

    return { deduplicationId: logData.deduplicationId };
  },
};
