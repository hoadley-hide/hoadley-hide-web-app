import type { IncomingMessage, ServerResponse } from "http";
import { Patrol, PatrolRaw } from "~/types";
import { EntityType, generateCode, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    name
    patrolNumber
    slug
  }`;

  const returnable = await simpleAllGraphQL<PatrolRaw, Patrol>(
    "patrols",
    `{ patrols ${fields} }`,
    {},
    (patrol): Patrol => ({
      _type: "patrol",
      id: patrol.id,
      code: generateCode(EntityType.Patrol, patrol.id),
      name: patrol.name,
      slug: patrol.slug,
      path: `/patrols/${patrol.slug}`,
      patrolNumber: patrol.patrolNumber,
      members: [
        {
          fullname: "Dirk Arends",
          formation: "Keith Farquhar Rovers",
        },
        {
          fullname: "Cheese Anderson",
          formation: "Victorian Venturer Council",
        },
        {
          fullname: "Paige Baddeley",
          formation: "Leichhardt Rovers",
        },
        {
          fullname: "Charlie O'Neil",
          formation: "Venturers",
        },
        {
          fullname: "Lucy",
          formation: "Venturers",
        },
        {
          fullname: "Jessy Lang",
          formation: "Boss Hurst Rovers",
        },
      ],
    })
  );

  res.statusCode = 200;
  return returnable;
};
