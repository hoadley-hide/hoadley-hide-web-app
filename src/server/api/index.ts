import type { IncomingMessage, ServerResponse } from "http";
import { GraphQL } from "~/types";
const baseUrl = process.env.CMS_URL || console.error("missing CMS_URL") || "";
const apikey = process.env.CMS_KEY || console.error("missing CMS_KEY") || "";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 404;
};

export const EntityType = {
  Stunt: { prefix: "S", length: 5 },
  EventStage: { prefix: "E", length: 5 },
  Patrol: { prefix: "P", length: 5 },
};

export function generateShortId(entityType, id: string) {
  return entityType.prefix + id.slice(id.length - entityType.length);
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

  const result: GraphQL<typeof key, Raw[]> = await response.json();

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

  const returnable: Data[] = result.data[key].map(mappingFn);

  return Promise.resolve({
    data: {
      [key]: returnable,
    },
  });
}
