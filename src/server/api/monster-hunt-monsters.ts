import type { IncomingMessage, ServerResponse } from "http";
import { MonsterHuntMonster, MonsterHuntMonsterRaw } from "~/types";
import { EntityType, generateCode, safeRichText, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    name
    slug
    description { html text }
    clues { html text }
  }`;

  const returnable = await simpleAllGraphQL<
    MonsterHuntMonsterRaw,
    MonsterHuntMonster
  >(
    "monsterHuntMonsters",
    `{ monsterHuntMonsters ${fields} }`,
    {},
    (monster): MonsterHuntMonster => ({
      _type: "monsterHuntMonster",
      id: monster.id,
      code: generateCode(EntityType.MonsterHuntMonster, monster.id),
      name: monster.name,
      slug: monster.slug,
      path: `/monster-hunt/${monster.slug}`,
      description: safeRichText(monster.description),
      clues: monster.clues,
    })
  );

  res.statusCode = 200;
  return returnable;
};
