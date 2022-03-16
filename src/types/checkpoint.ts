import { Admin, Patrol, Stunt } from ".";

export interface Checkpoint {
  id: string;
  recording: Stunt | Admin;
  patrol: Patrol;
  data: CheckpointStuntVisit;
}

interface CheckpointStuntVisit {
  type: "checkpoint:stunt:visit";
  "next-stunt": string;
  "check-in-time": string;
  "check-out-time": string;
  "previous-stunt": string;
  "score-attitude": string;
  "score-planning": string;
  "score-attainment": string;
  "score-leadership": string;
}
