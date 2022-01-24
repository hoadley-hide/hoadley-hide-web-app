import type { IncomingMessage, ServerResponse } from "http";
import { EventStage, EventStageRaw } from "~/types";
import { EntityType, generateCode, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    name
    slug
    description { html text }
    startTime
    instructions { html text }
  }`;

  const returnable = await simpleAllGraphQL<EventStageRaw, EventStage>(
    "eventStages",
    `{ eventStages(orderBy:startTime_ASC) ${fields} }`,
    {},
    (stage): EventStage => ({
      id: stage.id,
      code: generateCode(EntityType.EventStage, stage.id),
      name: stage.name,
      slug: stage.slug,
      path: `/event/${stage.slug}`,
      description: stage.description.html,
      descriptionText: stage.description.text,
      startTime: stage.startTime,
      instructions: stage.instructions,
    })
  );

  res.statusCode = 200;
  return returnable;
};
