import type { IncomingMessage, ServerResponse } from "http";
import { MonstemonGo, MonstemonGoRaw } from "~/types";
import { EntityType, generateCode, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    name
    slug
    description { html text }
    clues { html text }
  }`;

  const returnable = await simpleAllGraphQL<MonstemonGoRaw, MonstemonGo>(
    "monstemonGos",
    `{ monstemonGos ${fields} }`,
    {},
    (monster): MonstemonGo => ({
      _type: "monstemonGo",
      id: monster.id,
      code: generateCode(EntityType.MonstemonGo, monster.id),
      name: monster.name,
      slug: monster.slug,
      path: `/monstemonGo/${monster.slug}`,
      description: monster.description,
      clues: monster.clues,
    })
  );

  res.statusCode = 200;
  return returnable;
};
