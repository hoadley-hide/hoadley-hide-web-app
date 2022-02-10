export default ({ store }) => {
  navigator.serviceWorker.addEventListener("message", (data) => {
    console.log("activeuser", store.getter.activeUser);
    console.log("received", data);
  });
};
