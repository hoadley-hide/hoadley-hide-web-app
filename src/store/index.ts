import Vue from "vue";
import { ActionTree, GetterTree, MutationTree } from "vuex";
import { AppAlert } from "~/common/alert";
import { AppBreadcrumb } from "~/common/breadcrumb";
import { EventStage, GraphQL, Stunt } from "~/types";

export const state = () => ({
  alerts: [] as AppAlert[],
  breadcrumbs: [] as AppBreadcrumb[],
  eventStages: [] as EventStage[],
  stunts: [] as Stunt[],
  monsterAcronyms: [
    "Military Operational New Soldiers Trapped till Everybody Runs",
    "Many Oodles of Nutty Stories Threatening Earth’s Reality",
    "Martian Orbital Nuclear Spaceship for Terraforming into Earthlike Realm",
    "Mostly Online New System for Terrible Electronic Rucksacks",
    "Mining Operation for Nice Shiny Tiny Earth Rocks",
    "Monsters Official Network of Safe Tourist Extracurricular Reprieves",
  ],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  alerts: (state) => state.alerts,
  breadcrumbs: (state) => state.breadcrumbs,
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
    await dispatch("initialiseEventStages");
  },
  async initialiseStunts({ state }) {
    try {
      const result: GraphQL<"stunts", Stunt> = await $fetch("/api/stunts");
      if (result && result.data) {
        Vue.set(state, "stunts", result.data.stunts);
      }
    } catch (e) {
      const res: GraphQL<"stunts", Stunt> = await e.response.json();
      console.log(res);
      console.log(res.errors);
    }
  },
  async initialiseEventStages({ state }) {
    try {
      const result: GraphQL<"eventStages", EventStage> = await $fetch(
        "/api/event-stages"
      );
      if (result && result.data) {
        Vue.set(state, "eventStages", result.data.eventStages);
      }
    } catch (e) {
      const res: GraphQL<"eventStages", EventStage> = await e.response.json();
      console.log(res);
      console.log(res.errors);
    }
  },

  async validateCode({ state }, { code }) {
    const validCodes = [
      {
        name: "Event Stage",
        prefix: "E",
        codes: [
          { code: "ADFFS", to: "/event/pre-event" },
          { code: "AWESD", to: "/event/check-in" },
          { code: "MKLWE", to: "/event/rogaining" },
          { code: "PSDKJ", to: "/event/friday-night" },
          { code: "NKWEO", to: "/event/the-capture" },
        ],
      },
      {
        name: "Stunt",
        prefix: "S",
        codes: [
          { code: "ADFFS", to: "/stunts/1" },
          { code: "AWESD", to: "/stunts/2" },
          { code: "MKLWE", to: "/stunts/3" },
          { code: "PSDKJ", to: "/stunts/4" },
          { code: "NKWEO", to: "/stunts/5" },
        ],
      },
      {
        name: "Partol",
        prefix: "P",
        codes: [
          { code: "ADFFS", to: "/patrol/1" },
          { code: "AWESD", to: "/patrol/2" },
          { code: "MKLWE", to: "/patrol/3" },
          { code: "PSDKJ", to: "/patrol/4" },
          { code: "NKWEO", to: "/patrol/5" },
        ],
      },
    ];

    const compiledCodes = validCodes.flatMap((codeBlock) => {
      return codeBlock.codes.map((c) => ({
        code: `${codeBlock.prefix}${c.code}`,
        to: c.to,
      }));
    });

    const matchedCode = compiledCodes.find((route) => route.code === code);

    return matchedCode?.to || null;
  },
};
