import type { IncomingMessage, ServerResponse } from "http";
import {
  EventStage,
  EventStageDashboardAction,
  EventStageRaw,
  EventStageSignUpAction,
} from "~/types";
import { EntityType, generateCode, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
  const fields = `{
    id
    name
    slug
    icon
    description { html text }
    startTime
    showTime
    eventStageDay
    instructions { html text }
    autoShowAfterStartTime
    stageActions
  }`;

  const returnable = await simpleAllGraphQL<EventStageRaw, EventStage>(
    "eventStages",
    `{ eventStages(orderBy:startTime_ASC) ${fields} }`,
    {},
    (stage): EventStage => ({
      _type: "eventStage",
      id: stage.id,
      code: generateCode(EntityType.EventStage, stage.id),
      name: stage.name,
      slug: stage.slug,
      path: `/event/${stage.slug}`,
      icon: stage.icon,
      description: stage.description,
      startTime: stage.startTime,
      showTime: stage.showTime,
      eventStageDay:
        stage.eventStageDay.toLowerCase() as EventStage["eventStageDay"],
      instructions: stage.instructions,
      autoShowAfterStartTime: stage.autoShowAfterStartTime,
      stageActions: {
        dashboardActions:
          stage.stageActions?.dashboardActions?.map(
            (action): EventStageDashboardAction => ({
              title: action.title ?? "",
              subtitle: action.subtitle ?? "",
              icon: action.icon ?? "",
              to: String(action.to ?? ""),
              href: String(action.href ?? ""),
            })
          ) ?? [],
        signUpActions:
          stage.stageActions?.signUpActions?.map(
            (action): EventStageSignUpAction => ({
              title: action.title ?? "",
              subtitle: action.subtitle ?? "",
              colour: action.colour ?? "",
              to: String(action.to ?? ""),
              click: String(action.click ?? ""),
            })
          ) ?? [],
      },
    })
  );

  res.statusCode = 200;
  return returnable;
};
