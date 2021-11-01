import type { IncomingMessage, ServerResponse } from "http";
import { EventStage, EventStageRaw } from "~/types";
import { EntityType, generateShortId, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    name
    slug
    description { html text }
    startTime
  }`;

  const returnable = await simpleAllGraphQL<EventStageRaw, EventStage>(
    "eventStages",
    `{ eventStages(orderBy:startTime_ASC) ${fields} }`,
    {},
    (stage): EventStage => ({
      id: stage.id,
      shortId: generateShortId(EntityType.EventStage, stage.id),
      name: stage.name,
      slug: stage.slug,
      description: stage.description.html,
      descriptionText: stage.description.text,
      startTime: stage.startTime,
    })
  );

  res.statusCode = 200;
  return returnable;
};
