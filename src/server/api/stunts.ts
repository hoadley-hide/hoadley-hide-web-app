import type { IncomingMessage, ServerResponse } from "http";
import { Stunt, StuntRaw } from "~/src/types";
import { simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const returnable = await simpleAllGraphQL<StuntRaw, Stunt>(
    "stunts",
    `{ stunts {
    name
    icon
    description { html }
  } }`,
    {},
    (stunt): Stunt => ({
      name: stunt.name,
      icon: stunt.icon,
      description: stunt.description.html,
    })
  );
  
  res.statusCode = 200;
  return returnable;
};
