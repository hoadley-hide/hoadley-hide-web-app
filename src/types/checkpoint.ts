import { Admin, Patrol, Stunt, Walkpoint } from ".";

export interface Checkpoint {
  id: string;
  recording: Stunt | Admin | Walkpoint;
  patrol: Patrol;
  data: CheckpointStuntVisit | CheckpointWalkpointCapture;
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

export interface CheckpointWalkpointCapture {
  type: "checkpoint:walkpoint:capture";
  "walkpoint-capture-time": string;
}

export interface CheckpointVocEnter {
  type: "checkpoint:voc:enter";
  period: string;
  "voc-previous-stunt": string;
  "voc-check-in-time": string;
}

export interface CheckpointVocExit {
  type: "checkpoint:voc:exit";
  period: string;
  "voc-next-stunt": string;
  "voc-check-out-time": string;
}
