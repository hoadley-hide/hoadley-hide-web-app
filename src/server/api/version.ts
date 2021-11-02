import type { IncomingMessage, ServerResponse } from "http";
// import fs from "fs";

// const packageJson = fs.readFileSync("./package.json").toString();
// const version = JSON.parse(packageJson).version || 0;

export default async (_req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200;
  return {
    data: {
      currentVersion: 0,
    },
  };
};
