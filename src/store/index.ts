import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { AppAlert } from "~/common/alert";
import { AppBreadcrumb } from "~/common/breadcrumb";
import {
  AppUser,
  AppUserType,
  EventStage,
  GraphQL,
  Patrol,
  QrCodeLookup,
  QrCodeLookupPatrol,
  QrCodeLookupStage,
  QrCodeLookupStunt,
  ScannedCode,
  Stunt,
} from "~/types";

export const state = () => ({
  alerts: [] as AppAlert[],
  breadcrumbs: [] as AppBreadcrumb[],
  eventStages: [] as EventStage[],
  stunts: [] as Stunt[],
  patrols: [] as Patrol[],
  scannedCodes: [] as ScannedCode[],
  monsterAcronyms: [
    "Military Operational New Soldiers Trapped till Everybody Runs",
    "Many Oodles of Nutty Stories Threatening Earth’s Reality",
    "Martian Orbital Nuclear Spaceship for Terraforming into Earthlike Realm",
    "Mostly Online New System for Terrible Electronic Rucksacks",
    "Mining Operation for Nice Shiny Tiny Earth Rocks",
    "Monsters Official Network of Safe Tourist Extracurricular Reprieves",
  ],
  hasPermissionWarningBeenRead: false as boolean,
  packageVersion: process.env.PACKAGE_VERSION || "0",
  user: null as AppUser | null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  // Util getters
  appVersion: (state) => state.packageVersion,
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
  // User getters
  user: (state) => state.user,
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
  persistUser: (
    state,
    opts: { _type: "patrol"; patrol: Patrol } | { _type: "stunt"; stunt: Stunt }
  ) => {
    if (opts._type === "patrol") {
      const appUser: AppUser = {
        id: opts.patrol.id,
        _type: opts._type as AppUserType,
        code: opts.patrol.code,
        name: opts.patrol.name,
      };
      Vue.set(state, "user", appUser);
    } else if (opts._type === "stunt") {
      const appUser: AppUser = {
        id: opts.stunt.id,
        _type: opts._type as AppUserType,
        code: opts.stunt.code,
        name: opts.stunt.name,
      };
      Vue.set(state, "user", appUser);
    }
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
      commit("persistUser", {
        _type: "patrol",
        patrol: getters.patrol(opts.patrolId),
      });
    } else if ("stuntId" in opts) {
      commit("persistUser", {
        _type: "stunt",
        stunt: getters.stunt(opts.stuntId),
      });
    }
  },
};
