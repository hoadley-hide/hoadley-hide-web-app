import type { IncomingMessage, ServerResponse } from "http";
import { Stunt, StuntRaw } from "~/types";
import { EntityType, generateCode, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    name
    slug
    icon
    description { html text }
    location
  }`;

  const returnable = await simpleAllGraphQL<StuntRaw, Stunt>(
    "stunts",
    `{ stunts ${fields} }`,
    {},
    (stunt): Stunt => ({
      id: stunt.id,
      code: generateCode(EntityType.Stunt, stunt.id),
      name: stunt.name,
      slug: stunt.slug,
      path: `/stunts/${stunt.slug}`,
      icon: stunt.icon,
      description: stunt.description.html,
      descriptionText: stunt.description.text,
      location: stunt.location,
    })
  );

  res.statusCode = 200;
  return returnable;
};
