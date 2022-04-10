import type { IncomingMessage, ServerResponse } from "http";
import { Walkpoint, WalkpointRaw } from "~/types";
import { EntityType, generateCode, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    name
    slug
    icon
    description { html text }
    eventStageDay
    walkpointLetter
    coordinates
  }`;

  const returnable = await simpleAllGraphQL<WalkpointRaw, Walkpoint>(
    "walkpoints",
    `{ walkpoints ${fields} }`,
    {},
    (walkpoint): Walkpoint => ({
      _type: "walkpoint",
      id: walkpoint.id,
      code: generateCode(EntityType.Walkpoint, walkpoint.id),
      name: walkpoint.name,
      slug: walkpoint.slug,
      path: `/walkpoints/${walkpoint.slug}`,
      icon: walkpoint.icon,
      description: walkpoint.description,
      eventStageDay:
        walkpoint.eventStageDay.toLowerCase() as Walkpoint["eventStageDay"],
      walkpointLetter: walkpoint.walkpointLetter,
      coordinates: walkpoint.coordinates
        ? { x: walkpoint.coordinates.x, y: walkpoint.coordinates.y }
        : {},
    })
  );

  res.statusCode = 200;
  return returnable;
};
