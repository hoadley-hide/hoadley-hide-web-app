import { nuxtConfig } from "~/server/api/index";
import type { IncomingMessage, ServerResponse } from "http";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200;
  return {
    data: {
      currentVersion: nuxtConfig.RUNTIME_CONFIG.public.version,
    },
  };
};
