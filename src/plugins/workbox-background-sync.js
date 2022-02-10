// https://stackoverflow.com/questions/67497413/communicating-a-successful-workbox-background-sync-replay-to-open-clients

async function postSuccessMessage(response) {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    // Customize this message format as you see fit.
    client.postMessage({
      type: "REPLAY_SUCCESS",
      url: response.url,
    });
  }
}

const onSync = async ({ queue }) => {
  // TODO: Remove this environment override
  process.env.NODE_ENV = "dev";

  let entry;
  while ((entry = await queue.shiftRequest())) {
    try {
      const response = await fetch(entry.request.clone());

      postSuccessMessage(response);
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `Request for '${entry.request.url}'` +
            `has been replayed in queue '${queue._name}'`
        );
      }
    } catch (error) {
      await queue.unshiftRequest(entry);

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `Request for '${entry.request.url}'` +
            `failed to replay, putting it back in queue '${queue._name}'`
        );
      }
      throw new WorkboxError("queue-replay-failed", {
        name: queue._name,
      });
    }
  }
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `All requests in queue '${this.name}' have successfully ` +
        `replayed; the queue is now empty!`
    );
  }
};

console.log("backsync called");
workbox.routing.registerRoute(
  /\/api\/log/,
  new workbox.strategies.NetworkOnly({
    plugins: [
      new workbox.backgroundSync.Plugin("hh-queue", {
        maxRetentionTime: 60 * 24 * 5, // 5 Days (specified in minutes)
        onSync: onSync,
      }),
    ],
  }),
  "POST"
);
