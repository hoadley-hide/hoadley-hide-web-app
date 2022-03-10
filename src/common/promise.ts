export const promiseTimeout = (timeoutMs: number, ...args: Promise<any>[]) =>
  Promise.race([
    ...args,
    new Promise((resolve) =>
      setTimeout(() => resolve(new Error("Request timed out")), timeoutMs)
    ),
  ]);
