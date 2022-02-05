import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { AppAlert } from "~/common/alert";
import { AppBreadcrumb } from "~/common/breadcrumb";
import {
  AppUserEntity,
  EventStage,
  GraphQL,
  Patrol,
  QrCodeLookup,
  QrCodeLookupPatrol,
  QrCodeLookupStage,
  QrCodeLookupStunt,
  QrCodeLookupWikiArticle,
  ScannedCode,
  Stunt,
  WikiArticle,
} from "~/types";

export const state = () => ({
  alerts: [] as AppAlert[],
  breadcrumbs: [] as AppBreadcrumb[],
  eventStages: [] as EventStage[],
  stunts: [] as Stunt[],
  patrols: [] as Patrol[],
  wikiArticles: [] as WikiArticle[],
  scannedCodes: [] as ScannedCode[],
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
  stunt: (state) => (slugOrId) =>
    state.stunts.find(
      (stunt) => stunt.slug === slugOrId || stunt.code === slugOrId
    ),
  patrol: (state) => (slugOrId) =>
    state.patrols.find(
      (patrol) => patrol.slug === slugOrId || patrol.code === slugOrId
    ),
  eventStage: (state) => (slugOrId) =>
    state.eventStages.find(
      (stage) => stage.slug === slugOrId || stage.code === slugOrId
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

    const entity: QrCodeLookup = getters.compiledCodes.find(
      (lookup: QrCodeLookup) => lookup.code === state.user?.code
    );

    if (!entity) {
      return null;
    }

    switch (entity._type) {
      case "stunt":
        return entity.stunt;
      case "patrol":
        return entity.patrol;
      default:
        return null;
    }
  },
  // QR Codes
  compiledCodes: (state) => {
    const compiledCodes: QrCodeLookup[] = [
      ...state.eventStages.map(
        (stage): QrCodeLookupStage => ({
          _type: "stage",
          code: stage.code,
          stage,
        })
      ),
      ...state.stunts.map(
        (stunt): QrCodeLookupStunt => ({
          _type: "stunt",
          code: stunt.code,
          stunt,
        })
      ),
      ...state.patrols.map(
        (patrol): QrCodeLookupPatrol => ({
          _type: "patrol",
          code: patrol.code,
          patrol,
        })
      ),
      ...state.wikiArticles.map(
        (wikiArticle): QrCodeLookupWikiArticle => ({
          _type: "wiki",
          code: wikiArticle.code,
          wikiArticle,
        })
      ),
    ];

    return compiledCodes;
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
  recordCodeScan: (state, scannedCode: QrCodeLookup) => {
    Vue.set(state.scannedCodes, state.scannedCodes.length, {
      time: new Date(),
      code: scannedCode.code,
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
  setStunts: (state, stunts) => {
    Vue.set(state, "stunts", stunts);
  },
  setPatrols: (state, patrols) => {
    Vue.set(state, "patrols", patrols);
  },
  setEventStages: (state, eventStages) => {
    Vue.set(state, "eventStages", eventStages);
  },
  setWikiArticles: (state, wikiArticles) => {
    Vue.set(state, "wikiArticles", wikiArticles);
  },
  // User
  persistUser: (state, entity: AppUserEntity) => {
    Vue.set(state, "user", entity);
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
    await dispatch("initialiseStunts");
    await dispatch("initialisePatrols");
    await dispatch("initialiseEventStages");
    await dispatch("initialiseWikiArticles");
  },
  async initialiseStunts({ commit }) {
    try {
      const result: GraphQL<"stunts", Stunt> = await $fetch("/api/stunts");
      if (result && result.data) {
        commit("setStunts", result.data.stunts);
      }
    } catch (e) {
      const res: GraphQL<"stunts", Stunt> = await e.response;
      console.log(res);
      console.log(res.errors);
    }
  },
  async initialisePatrols({ commit }) {
    try {
      const result: GraphQL<"patrols", EventStage> = await $fetch(
        "/api/patrols"
      );
      if (result && result.data) {
        commit("setPatrols", result.data.patrols);
      }
    } catch (e) {
      const res: GraphQL<"patrols", EventStage> = await e.response;
      console.log(res);
      console.log(res.errors);
    }
  },
  async initialiseEventStages({ commit }) {
    try {
      const result: GraphQL<"eventStages", EventStage> = await $fetch(
        "/api/event-stages"
      );
      if (result && result.data) {
        commit("setEventStages", result.data.eventStages);
      }
    } catch (e) {
      const res: GraphQL<"eventStages", EventStage> = await e.response;
      console.log(res);
      console.log(res.errors);
    }
  },
  async initialiseWikiArticles({ commit }) {
    try {
      const result: GraphQL<"wikiArticles", WikiArticle> = await $fetch(
        "/api/wiki-articles"
      );
      if (result && result.data) {
        commit("setWikiArticles", result.data.wikiArticles);
      }
    } catch (e) {
      const res: GraphQL<"wikiArticles", WikiArticle> = await e.response;
      console.log(res);
      console.log(res.errors);
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

  async recordCodeScan({ commit }, lookup: QrCodeLookup) {
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
    opts: { patrolId: string } | { stuntId: string }
  ) {
    if ("patrolId" in opts) {
      commit("persistUser", getters.patrol(opts.patrolId));
    } else if ("stuntId" in opts) {
      commit("persistUser", getters.stunt(opts.stuntId));
    }
  },
};
