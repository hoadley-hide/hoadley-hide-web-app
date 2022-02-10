import { RuntimeConfig } from "@/nuxt.config";
import type { IncomingMessage, ServerResponse } from "http";
import { GraphQL } from "~/types";
const baseUrl = process.env.CMS_URL || console.error("missing CMS_URL") || "";
const apikey = process.env.CMS_KEY || console.error("missing CMS_KEY") || "";

export const nuxtConfig = {
  NUXT_NO_SSR: process.env.NUXT_NO_SSR as unknown as boolean,
  NUXT_STATIC_BASE: process.env.NUXT_STATIC_BASE as unknown as string,
  NUXT_STATIC_VERSION: process.env.NUXT_STATIC_VERSION as unknown as string,
  NUXT_FULL_STATIC: process.env.NUXT_FULL_STATIC as unknown as boolean,
  NITRO_PRESET: process.env.NITRO_PRESET as unknown as string,
  RUNTIME_CONFIG: process.env.RUNTIME_CONFIG as unknown as RuntimeConfig,
  DEBUG: process.env.DEBUG as unknown as boolean,
  BASE_URL: process.env.CMS_URL || console.error("missing CMS_URL") || "",
  API_KEY: process.env.CMS_KEY || console.error("missing CMS_KEY") || "",
};

export default async (_req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 404;
};

export const EntityType = {
  Admin: { prefix: "A", length: 5 },
  EventStage: { prefix: "E", length: 5 },
  MonstemonGo: { prefix: "M", length: 5 },
  Patrol: { prefix: "P", length: 5 },
  Stunt: { prefix: "S", length: 5 },
  WikiArticle: { prefix: "W", length: 5 },
};

export function generateCode(entityType, id: string) {
  const code = entityType.prefix + id.slice(id.length - entityType.length);
  return code.toUpperCase();
}

export async function simpleAllGraphQL<Raw, Data>(
  key: string,
  query: string,
  variables: any,
  mappingFn: (item: Raw) => Data
): Promise<GraphQL<typeof key, Data[]>> {
  let response: Response | null = null;
  try {
    response = await fetch(baseUrl, {
      method: "post",
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
      headers: {
        Authorization: `Bearer ${apikey}`,
      },
    });
  } catch (e) {
    return Promise.resolve({
      errors: [{ message: "An unknown error occurred: request failed" }],
      extensions: { requestId: "000000" },
    });
  }

  const result: GraphQL<typeof key, Raw | Raw[]> = await response.json();

  if (!result) {
    return Promise.resolve({
      errors: [{ message: "An unknown error occurred: missing response" }],
      extensions: { requestId: "000000" },
    });
  }

  if (result.errors) {
    return Promise.resolve({
      errors: result.errors,
      extensions: result.extensions,
    });
  }

  if (!result.data) {
    return Promise.resolve({
      errors: [{ message: "An unknown error occurred: missing data" }],
      extensions: result.extensions,
    });
  }

  const queryData = result.data[key];

  const returnable: Data[] = Array.isArray(queryData)
    ? queryData.map(mappingFn)
    : [mappingFn(queryData)];

  return Promise.resolve({
    data: {
      [key]: returnable,
    },
  });
}

export async function streamData<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      resolve(JSON.parse(body ?? "{}") ?? {});
    });
  });
}
