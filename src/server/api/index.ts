import { RuntimeConfig } from "@/nuxt.config";
import type { IncomingMessage, ServerResponse } from "http";
import { GraphQL, GraphQLBasic, RichText } from "~/types";
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
  MonsterHuntMonster: { prefix: "M", length: 5 },
  Patrol: { prefix: "P", length: 5 },
  Stunt: { prefix: "S", length: 5 },
  WikiArticle: { prefix: "W", length: 5 },
};

export function generateCode(entityType, id: string) {
  const code = entityType.prefix + id.slice(id.length - entityType.length);
  return code.toUpperCase();
}

export function makeError(
  res: ServerResponse,
  status: number,
  msgs: string | string[],
  extensions?: object[]
) {
  res.statusCode = status;

  const messages = Array.isArray(msgs) ? msgs : [msgs];

  return {
    errors: messages.map((message) => ({ message: message })),
    extensions,
  };
}

export function safeRichText(richText: RichText | null): RichText {
  return {
    html: richText?.html ?? "",
    text: richText?.text ?? "",
  };
}

export async function simpleGraphQL<RawData>(
  query: string,
  variables: any
): Promise<GraphQLBasic<RawData>> {
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
    return {
      errors: [{ message: "An unknown error occurred: request failed" }],
      extensions: { requestId: "000000" },
    };
  }

  const result: GraphQLBasic<RawData> = await response.json();

  if (!result) {
    return {
      errors: [{ message: "An unknown error occurred: missing response" }],
      extensions: { requestId: "000000" },
    };
  }

  if (result.errors) {
    return {
      errors: result.errors,
      extensions: result.extensions,
    };
  }

  if (!result.data) {
    return {
      errors: [{ message: "An unknown error occurred: missing data" }],
      extensions: result.extensions,
    };
  }

  return { data: result.data };
}

export async function simpleAllGraphQL<Raw, Data>(
  key: string,
  query: string,
  variables: any,
  mappingFn: (item: Raw) => Data
): Promise<GraphQL<typeof key, Data[]>> {
  interface RawData {
    [datakey: typeof key]: Raw[];
  }

  let response: GraphQLBasic<RawData> = await simpleGraphQL<RawData>(
    query,
    variables
  );

  if (!response.data) {
    return {
      errors: response.errors,
      extensions: response.extensions,
    };
  }

  const queryData = response.data[key].map(mappingFn);

  return Promise.resolve({
    data: {
      [key]: queryData,
    },
  });
}

export async function body2Data<Data>(
  req: IncomingMessage
): Promise<Partial<Data>> {
  if (req.body || process.env.NETLIFY === "true") {
    return JSON.parse(req.body ?? "{}") ?? {};
  } else {
    return await new Promise((resolve) => {
      var result: any[] = [];
      req.on("data", function (chunk) {
        console.error("RESPONSE DATA", chunk);
        result.push(chunk);
      });

      req.on("end", function () {
        console.error("RESPONSE END");
        const output = Buffer.concat(result).toString("utf8");
        resolve(JSON.parse(output));
      });
    });
  }
}
