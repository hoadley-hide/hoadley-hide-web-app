import type { IncomingMessage, ServerResponse } from "http";
import { EventStage, EventStageRaw } from "~/src/types";
import { simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const returnable = await simpleAllGraphQL<EventStageRaw, EventStage>(
    "eventStages",
    `{ eventStages {
    name
    description { html }
  } }`,
    {},
    (stage): EventStage => ({
      name: stage.name,
      description: stage.description.html,
    })
  );

  res.statusCode = 200;
  return returnable;
};
