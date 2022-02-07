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
}

export interface EventStageRaw {
  id: string;
  name: string;
  slug: string;
  description: RichText;
  startTime: string;
  instructions: RichText[];
  autoShowAfterStartTime: boolean;
}
