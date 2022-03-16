import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "hh-2022",
    paths: [
      "eventLogs",
      "hasPermissionWarningBeenRead",
      "impersonator",
      "checkpoint.inflightCheckpoints",
      "monsterHuntCluesIssued",
      "pendingLogIds",
      "scannedCodes",
      "user",
    ],
  })(store);
};
