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

interface CheckpointVocEnter {
  type: "checkpoint:voc:enter";
  "next-stunt": string;
  "previous-stunt": string;
}

interface CheckpointVocExit {
  type: "checkpoint:voc:exit";
  "next-stunt": string;
  "previous-stunt": string;
}
