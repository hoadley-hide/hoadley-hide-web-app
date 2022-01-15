import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "hh-2022",
    paths: [
      "user", // wrap lines.
      "scannedCodes",
      "hasPermissionWarningBeenRead",
    ],
  })(store);
};
