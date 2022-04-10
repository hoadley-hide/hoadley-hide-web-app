import hasher from "object-hash";
import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { AppAlert, createAlert } from "~/common/alert";
import { AppBreadcrumb } from "~/common/breadcrumb";
import { promiseTimeout } from "~/common/promise";
import { names as patrol } from "~/store/patrol";
import { names as stunt } from "~/store/stunt";
import {
  Admin,
  AppUserEntity,
  Entity,
  EventLog,
  EventLogAugmented,
  EventLogPersisted,
  EventStage,
  GraphQL,
  GraphQLBasic,
  MonsterHuntMonster,
  MonsterHuntMonsterIssued,
  MonsterHuntMonsterIssuedStored,
  MonsterHuntPlayer,
  Patrol,
  QrCodeableEntity,
  Question,
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
  monsterHuntMonsters: [] as MonsterHuntMonster[],
  questions: [] as Question[],
  wikiArticles: [] as WikiArticle[],
  // Other Stuff
  scannedCodes: [] as QrCodeableEntity[],
  monsterHuntCluesIssued: [] as MonsterHuntMonsterIssuedStored[],
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
  impersonator: null as Admin | null,
  eventLogs: [] as EventLog[],
  pendingLogIds: [] as string[],
  eventDay: "whole-event" as "whole-event" | "saturday" | "sunday",
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
    state.admins.find((admin) =>
      [admin.id, admin.slug, admin.code].includes(slugOrId)
    ),
  eventStage: (state) => (slugOrId) =>
    state.eventStages.find((stage) =>
      [stage.id, stage.slug, stage.code].includes(slugOrId)
    ),
  monsterHuntMonster: (state) => (slugOrId) =>
    state.monsterHuntMonsters.find((monster) =>
      [monster.id, monster.slug, monster.code].includes(slugOrId)
    ),
  wikiArticle: (state) => (slugOrId) =>
    state.wikiArticles.find((wikiArticle) =>
      [wikiArticle.id, wikiArticle.slug, wikiArticle.code].includes(slugOrId)
    ),
  reviewQuestions: (state) => {
    return state.questions.filter(
      (question) => question.questionGroup === "review:stunt"
    );
  },
  checkpointStuntVisitQuestions: (state) => {
    return state.questions
      .filter((question) => question.questionGroup === "checkpoint:stunt:visit")
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  // User getters
  user: (state): AppUserEntity | null => {
    if (!state.user) {
      return null;
    }

    return state.user ?? null;
  },
  userSetupRequired: (_state, getters): boolean => {
    if (getters.user) {
      return false;
    }

    return true;
  },
  eventStagesOldestFirst: (state) => {
    return state.eventStages
      .map((x) => x)
      .sort((a: EventStage, b: EventStage) => {
        return Date.parse(a.startTime) - Date.parse(b.startTime);
      });
  },
  eventStagesNewestFirst: (_state, getters) => {
    return getters.eventStagesOldestFirst.reverse();
  },
  scannedEventStages: (_state, getters) => {
    return getters.eventStagesNewestFirst.filter((stage: EventStage) => {
      const stageAlwaysShown =
        stage.autoShowAfterStartTime &&
        Date.parse(stage.startTime) < Date.now();

      const codeScanned = getters.hasCodeBeenScanned(stage.code);
      return codeScanned || stageAlwaysShown;
    });
  },
  activeEventStage: (_state, getters) => {
    return getters.scannedEventStages[0];
  },
  eventDay: (state) => {
    return state.eventDay;
  },
  eventDayCheck: (_state, getters) => (eventDay) => {
    return getters.eventDay === "whole-event" || eventDay === getters.eventDay;
  },
  nextEventStage: (_state, getters) => {
    const activeStageIndex = getters.eventStagesNewestFirst.indexOf(
      getters.activeEventStage
    );

    if (activeStageIndex === -1) {
      return null;
    }

    return getters.eventStagesNewestFirst[activeStageIndex - 1];
  },
  // Monster Hunt
  remainingMonsters: (state, getters) => {
    const remainingMonsters = state.monsterHuntMonsters.filter(
      (monster: MonsterHuntMonster) => {
        const codeScanned = getters.hasCodeBeenScanned(monster.code);
        return !codeScanned;
      }
    );
    return remainingMonsters;
  },
  remainingClues: (state, getters) => {
    const remainingMonstersClues = state.monsterHuntMonsters.filter(
      (monster: MonsterHuntMonster) => {
        const beenRevealed = getters.monsterHuntClueRevealed(monster);
        return !beenRevealed;
      }
    );
    return remainingMonstersClues;
  },
  monsterHuntCanGiveClue:
    (state) =>
    (monster: MonsterHuntMonster): boolean => {
      if (!monster) {
        return false;
      }

      const hasGivenAClue = state.monsterHuntCluesIssued.find(
        (issued) => issued.by?.id === monster.id
      );

      if (hasGivenAClue) {
        return false;
      }

      return true;
    },
  monsterHuntClueRevealed:
    (state) =>
    (monster: MonsterHuntMonster): boolean => {
      const hasClueRevealed = state.monsterHuntCluesIssued.find(
        (issued) => issued.for.id === monster.id
      );
      return !!hasClueRevealed;
    },
  monsterHuntCluesIssued: (state, getters): MonsterHuntMonsterIssued[] => {
    const issuedClues = state.monsterHuntCluesIssued
      .map((issued) => {
        const monster = getters.monsterHuntMonster(issued.for.id);
        return {
          monster: monster,
          scanned: getters.hasCodeBeenScanned(monster.code),
        };
      })
      .sort((a, b) => {
        if (!a.scanned && b.scanned) {
          // A not scanned, move it closer to the start of the array.
          return -1;
        }
        if (a.scanned && !b.scanned) {
          // A scanned, move it closer to the end of the array.
          return 1;
        }
        // Both scanned or not scanned.
        // Reposition by alpha.
        return a.monster.name.localeCompare(b.monster.name);
      });
    return issuedClues;
  },
  // QR Codes
  findById: (_state, getters) => getters.findByIdOrCode,
  findByIdOrCode:
    (state) =>
    (idOrCode: string): Entity | null => {
      if (!idOrCode) {
        return null;
      }
      const compiledCodes: Entity[] = [
        ...state.admins,
        ...state.eventStages,
        ...state.monsterHuntMonsters,
        ...state.patrol.patrols,
        ...state.stunt.stunts,
        ...state.wikiArticles,
      ];

      const entity = compiledCodes.find(
        (entity) =>
          entity.id === idOrCode ||
          ("code" in entity && entity.code === idOrCode.toUpperCase())
      );

      return entity ?? null;
    },
  // TODO: Move to event-log store.
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
          eventLog.recordingEntity?.id === getters.user?.id &&
          eventLog.referencedEntity?.id === stunt.id
      );
    },
  // TODO: Move to event-log store.
  reviewsRecordedBySelf: (state, getters): EventLogAugmented[] => {
    if (!state.user) {
      return [];
    }

    const logs: EventLog[] = state.eventLogs.filter(
      (eventLog) =>
        eventLog.type === "review:stunt" &&
        eventLog.recordingEntity?.id === state.user?.id
    );

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
        isPersisted: !state.pendingLogIds.includes(log.deduplicationId),
      })
    );
  },
  // TODO: Move to event-log store.
  reviewsReferencingSelf: (state, getters): EventLogAugmented[] => {
    if (!state.user) {
      return [];
    }

    const logs: EventLog[] = state.eventLogs.filter(
      (eventLog) =>
        eventLog.type === "review:stunt" &&
        eventLog.referencedEntity?.id === state.user?.id
    );

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
        isPersisted: !state.pendingLogIds.includes(log.deduplicationId),
      })
    );
  },

  // TODO: Move to event-log store.
  checkpointStuntVisit: (state, getters): EventLogAugmented[] => {
    if (!state.user) {
      return [];
    }

    const logs: EventLog[] = state.eventLogs.filter(
      (eventLog) => eventLog.type === "checkpoint:stunt:visit" // &&
      // eventLog.referencedEntity?.id === state.user?.id
    );

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
        isPersisted: !state.pendingLogIds.includes(log.deduplicationId),
      })
    );
  },

  // TODO: Move to event-log store.
  pendingRequests: (state, getters): EventLogAugmented[] => {
    if (!state.user) {
      return [];
    }

    const logs: EventLog[] = state.eventLogs.filter((eventLog) =>
      state.pendingLogIds.includes(eventLog.deduplicationId)
    );

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
  setAlertTimeoutWrapper: (
    _state,
    opts: {
      appAlert: AppAlert;
      callback: (alert: AppAlert) => void;
      millis: number;
    }
  ) => {
    // This setTimeout function needs to be wrapped by a mutation for VueX reasons.
    opts.appAlert.setTimeout(opts.callback, opts.millis);
  },
  setBreadcrumbs: (state, breadcrumbs: AppBreadcrumb[]) => {
    Vue.set(state, "breadcrumbs", breadcrumbs);
  },
  permissionWarningHasBeenRead: (state) => {
    Vue.set(state, "hasPermissionWarningBeenRead", true);
  },
  recordCodeScan: (state, entity: QrCodeableEntity) => {
    const scannedData: ScannedCode = {
      time: new Date().toISOString(),
      code: entity.code,
    };
    Vue.set(state.scannedCodes, state.scannedCodes.length, scannedData);
  },
  removeCodeScan: (state, code: string) => {
    const scanned = state.scannedCodes.find((e) => e.code === code);
    console.log(scanned);
    if (!scanned) {
      return;
    }

    state.scannedCodes.splice(state.scannedCodes.indexOf(scanned), 1);
  },
  clearScannedCodes: (state) => {
    Vue.set(state, "scannedCodes", []);
    Vue.set(state, "monsterHuntCluesIssued", []);
  },
  resetApp: (state) => {
    Vue.set(state, "user", null);
    Vue.set(state, "scannedCodes", []);
    Vue.set(state, "hasPermissionWarningBeenRead", false);
    Vue.set(state, "eventLogs", []);
    Vue.set(state, "pendingLogIds", []);
    Vue.set(state, "monsterHuntCluesIssued", []);
    Vue.set(state.checkpoint, "inflightCheckpoints", []);
  },
  // Entities
  setAdmins: (state, admins) => {
    Vue.set(state, "admins", admins);
  },
  setEventStages: (state, eventStages) => {
    Vue.set(state, "eventStages", eventStages);
  },
  setMonsterHuntMonsters: (state, monsterHuntMonsters) => {
    Vue.set(state, "monsterHuntMonsters", monsterHuntMonsters);
  },
  setQuestions: (state, questions) => {
    Vue.set(state, "questions", questions);
  },
  setWikiArticles: (state, wikiArticles) => {
    Vue.set(state, "wikiArticles", wikiArticles);
  },
  setEventLogs: (state, logDatas: EventLog[]) => {
    // Fetch currently pending requests.
    const reservePending = state.pendingLogIds.map((pendingId) =>
      state.eventLogs.find((log) => log.deduplicationId === pendingId)
    );

    // Replace state with currently pending logs and the new from the db.
    Vue.set(state, "eventLogs", [...reservePending, ...logDatas]);
  },
  // User
  persistUser: (state, entity: AppUserEntity) => {
    Vue.set(state, "user", entity);
  },
  persistImpersonator: (state, entity: Admin) => {
    Vue.set(state, "impersonator", entity);
  },
  collectClue: (state, clue: MonsterHuntMonsterIssuedStored) => {
    Vue.set(
      state.monsterHuntCluesIssued,
      state.monsterHuntCluesIssued.length,
      clue
    );
  },
  addEventLogRequest: (state, logData: EventLog) => {
    // Record dedup id as pending is not already.
    if (!state.pendingLogIds.includes(logData.deduplicationId)) {
      Vue.set(
        state.pendingLogIds,
        state.pendingLogIds.length,
        logData.deduplicationId
      );
    }

    // Record log dataset for immediate use in app.
    const existingLogIndex = state.eventLogs.findIndex(
      (log) => log.deduplicationId === logData.deduplicationId
    );

    // Replace existing entry if present.
    if (existingLogIndex !== -1) {
      Vue.set(state.eventLogs, existingLogIndex, logData);
      return;
    }

    Vue.set(state.eventLogs, state.eventLogs.length, logData);
  },
  addEventLog: (state, logData: EventLog) => {
    const existingLogIndex = state.eventLogs.findIndex(
      (log) => log.deduplicationId === logData.deduplicationId
    );

    // Replace existing entry if present.
    if (existingLogIndex !== -1) {
      Vue.set(state.eventLogs, existingLogIndex, logData);
      return;
    }

    Vue.set(state.eventLogs, state.eventLogs.length, logData);
  },
  recordEventLogPersist: (state, opt: { deduplicationId: string }) => {
    // Remove dedup id from the pending list.
    state.pendingLogIds.splice(
      state.pendingLogIds.indexOf(opt.deduplicationId),
      1
    );
  },
  recordEventLogDelete: (state, opt: { deduplicationId: string }) => {
    // Remove request from the local log list.
    state.eventLogs.splice(
      state.eventLogs.findIndex(
        (log) => log.deduplicationId === opt.deduplicationId
      ),
      1
    );
    // Remove dedup id from the pending list.
    state.pendingLogIds.splice(
      state.pendingLogIds.indexOf(opt.deduplicationId),
      1
    );
  },

  setEventDay: (state, eventDay: string) => {
    const newEventDay = ["saturday", "sunday"].includes(eventDay)
      ? eventDay
      : "whole-event";

    if (newEventDay !== state.eventDay) {
      Vue.set(state, "eventDay", newEventDay);
    }
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

    if (appAlert.deduplicate && duplicateAlert) {
      // Deduplication is enabled & the alert is a duplicate.
      // Don't add a new alert.

      // Do extend time for existing alert.
      commit("setAlertTimeoutWrapper", {
        appAlert: duplicateAlert,
        callback: (alert) => {
          dispatch(`expireAlert`, alert);
        },
        millis: 5000,
      });

      return;
    }

    commit("setAlertTimeoutWrapper", {
      appAlert: appAlert,
      callback: (alert) => {
        dispatch(`expireAlert`, alert);
      },
      millis: 5000,
    });

    commit("addAlert", appAlert);
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
      path: "/api/monster-hunt-monsters",
      dataKey: "monsterHuntMonsters",
      mutation: "setMonsterHuntMonsters",
    });
    await dispatch(patrol.actions.initialise);
    await dispatch("initialiseEntity", {
      path: "/api/questions",
      dataKey: "questions",
      mutation: "setQuestions",
    });
    await dispatch(stunt.actions.initialise);
    await dispatch("initialiseEntity", {
      path: "/api/wiki-articles",
      dataKey: "wikiArticles",
      mutation: "setWikiArticles",
    });
  },
  async initialiseEntity({ commit }, { path, dataKey, mutation }) {
    type ResultType = GraphQL<
      string,
      EventStage[] | Patrol[] | WikiArticle[] | MonsterHuntMonster[]
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

    return getters.findByIdOrCode(code) || null;
  },

  async recordCodeScan({ commit }, lookup: Entity) {
    commit("recordCodeScan", lookup);
  },
  async removeCodeScan({ commit }, code: string) {
    commit("removeCodeScan", code);
  },
  async clearScannedCodes({ commit }) {
    commit("clearScannedCodes");
  },

  async resetApp({ commit }) {
    commit("resetApp");
  },

  async persistUser(
    { state, getters, commit },
    opts: ({ adminId: string } | MonsterHuntPlayer | Entity) & {
      impersonate?: boolean;
    }
  ) {
    if (opts.impersonate && state.impersonator?._type === "admin") {
      // No action requried, current impersonator is just changing user data.
    } else if (opts.impersonate && getters.user?._type === "admin") {
      commit("persistImpersonator", getters.user);
    } else if (opts.impersonate === false && state.impersonator) {
      commit("persistUser", state.impersonator);
      commit("persistImpersonator", null);
      return;
    }

    if ("id" in opts) {
      const found = getters.findById(opts.id);
      if (found) {
        commit("persistUser", found);
        return;
      }
    }

    if ("adminId" in opts) {
      commit("persistUser", getters.admin(opts.adminId));
    } else if ("_type" in opts && opts._type === "monsterHuntPlayer") {
      commit("persistUser", opts);
    }
  },

  async persistEventLog(
    { state, commit },
    logData: EventLog & { quiet?: boolean }
  ) {
    const existingLog = state.eventLogs.find(
      (log) => log.deduplicationId === logData.deduplicationId
    );

    // New version or new log entry.
    const newVersion = existingLog?.version !== logData.version;
    const isPending = state.pendingLogIds.includes(logData.deduplicationId);

    // Always update the data in memory.
    if (newVersion) {
      commit("addEventLogRequest", logData);
    }

    if (!newVersion && isPending) {
      // This current version has been persisted,  just return a success.
      return { deduplicationId: existingLog.deduplicationId };
    }
    console.log("logData.quiet", logData.quiet);

    try {
      const res = await promiseTimeout(
        5000,
        $fetch("/api/event", {
          method: "POST",
          body: logData,
        })
      );

      if (res.message === "Request timed out") {
        throw res;
      }

      commit("recordEventLogPersist", {
        deduplicationId: logData.deduplicationId,
      });
    } catch (e) {
      console.log(e);

      if (logData.quiet) {
        return {
          deduplicationId: logData.deduplicationId,
        };
      }

      await createAlert(this, {
        heading: "Currently unable to record log to server",
        message:
          "But dont worry, we have saved it locally and you can try it again later",
        type: "error",
      });

      throw new Error(`Event Log Failed: ${e.message}`);
    }

    return {
      deduplicationId: logData.deduplicationId,
    };
  },

  async deleteEventLog({ state, commit }, logData: EventLog) {
    const existingLog = state.eventLogs.find(
      (log) => log.deduplicationId === logData.deduplicationId
    );

    if (!existingLog) {
      createAlert(this, {
        message: "Event log not currently loaded",
        type: "error",
      });
      return;
    }

    try {
      const result: GraphQL<"eventLog", EventLogPersisted> = await $fetch(
        `/api/event/_id/${logData.deduplicationId}`,
        {
          method: "DELETE",
        }
      );

      if (result.data?.eventLog?.deduplicationId !== logData.deduplicationId) {
        await createAlert(this, {
          message: "Failed to delete event log entry",
          type: "error",
        });
        return;
      }
      console.log(result);
      commit("recordEventLogDelete", {
        deduplicationId: logData.deduplicationId,
      });

      await createAlert(this, {
        heading: `Event log deleted`,
        message: `${logData.type} - ${logData.deduplicationId}`,
        type: "success",
      });
    } catch (e) {
      console.log(e);
      await createAlert(this, {
        message: "Failed to delete event log entry",
        type: "error",
      });
    }
  },

  async fetchMyEventLogs(
    { state, commit, getters },
    opts?: { syncMode: "full" | "diff" }
  ) {
    if (!getters.user) {
      createAlert(this, { message: "Not logged in", type: "warning" });
      return false;
    }
    try {
      const urlParams = new URLSearchParams();
      urlParams.set("user", `${getters.user._type}:${getters.user.id}`);

      if (opts?.syncMode === "diff") {
        const dates = state.eventLogs.map((log: EventLog) => {
          try {
            return Date.parse(log.version);
          } catch {
            return 0;
          }
        });

        const hashValue = hasher(
          state.eventLogs.map((log: EventLog) => log.hash),
          { unorderedArrays: true }
        );

        if (dates.length !== 0 && hashValue) {
          urlParams.set("diff", hashValue);
          urlParams.set("from", new Date(Math.max(...dates)).toISOString());
        }
      }

      const result: GraphQLBasic<{
        eventLogs: EventLog[];
        allResultsReturned: boolean;
      }> = await $fetch(`/api/event?${urlParams.toString()}`);
      if (!result?.data) {
        return;
      }

      if (opts?.syncMode === "full" || result.data.allResultsReturned) {
        commit("setEventLogs", result.data.eventLogs);
      } else {
        result.data.eventLogs.forEach((log) => commit("addEventLog", log));
      }
    } catch (e) {
      throw e;
      // const res: ResultType = await (e as any).response;
      // console.log(res);
      // console.log(res.errors);
    }
  },

  async fetchMyReviews({ commit, getters }) {
    if (!getters.user) {
      createAlert(this, { message: "Not logged in", type: "warning" });
      return false;
    }
    try {
      const result: GraphQL<"eventLogs", EventLog[]> = await $fetch(
        `/api/event?user=${getters.user._type}:${getters.user.id}`
      );
      if (result?.data) {
        result.data.eventLogs.forEach((log) => commit("addEventLog", log));
      }
    } catch (e) {
      throw e;
      // const res: ResultType = await (e as any).response;
      // console.log(res);
      // console.log(res.errors);
    }
  },

  async collectClue({ commit, getters }, byMonster: MonsterHuntMonster) {
    const forMonster =
      getters.remainingClues[
        (getters.remainingClues.length * Math.random()) | 0
      ];

    if (!forMonster) {
      return false;
    }

    const clue: MonsterHuntMonsterIssuedStored = {
      by: byMonster,
      for: forMonster,
    };
    commit("collectClue", clue);

    if (!getters.monsterHuntClueRevealed(byMonster)) {
      // This monster's clue has not been given previously,
      // but the monster was found. Show the clue anyway.
      const clue: MonsterHuntMonsterIssuedStored = {
        by: null,
        for: byMonster,
      };
      commit("collectClue", clue);
    }
    return true;
  },
};
