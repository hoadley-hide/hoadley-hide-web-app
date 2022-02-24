import { RichText } from "..";

export interface EventStage {
  _type: "eventStage";
  id: string;
  code: string;
  name: string;
  slug: string;
  path: string;
  description: RichText;
  startTime: string;
  instructions: RichText[];
  autoShowAfterStartTime: boolean;
  stageActions: EventStageActions;
}

export interface EventStageActions {
  signUpActions: EventStageSignUpAction[];
  dashboardActions: EventStageDashboardAction[];
}

export interface EventStageSignUpAction {
  title: string;
  subtitle: string;
  colour: string;
  to: string;
  click: string;
}

export interface EventStageDashboardAction {
  title: string;
  subtitle: string;
  icon: string;
  to?: string;
  href?: string;
}

export interface EventStageRaw {
  id: string;
  name: string;
  slug: string;
  description: RichText;
  startTime: string;
  instructions: RichText[];
  autoShowAfterStartTime: boolean;
  stageActions?: Partial<EventStageActions>;
}
