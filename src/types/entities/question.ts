export interface Question {
  _type: "question";
  id: string;
  heading: string;
  storageKey: string;
  questionFieldType:
    | "LongAnswer"
    | "Rating"
    | "ShortAnswer"
    | "StuntPicker"
    | "Time";
  questionGroup:
    | "review:stunt"
    | "checkpoint:stunt:visit"
    | "checkpoint:voc:enter"
    | "checkpoint:voc:exit";
  description: string;
  tickLabels: string[];
  sortOrder: number;
}

export interface QuestionRaw {
  id: string;
  heading: string;
  storageKey: string;
  questionFieldType:
    | "LongAnswer"
    | "Rating"
    | "ShortAnswer"
    | "StuntPicker"
    | "Time";
  questionGroup:
    | "review_stunt"
    | "checkpoint_stunt_visit"
    | "checkpoint_voc_enter"
    | "checkpoint_voc_exit";
  description: string;
  tickLabels: string[];
  sortOrder: number;
}
