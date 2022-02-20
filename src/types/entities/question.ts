export interface Question {
  _type: "question";
  id: string;
  heading: string;
  storageKey: string;
  questionFieldType: "Rating" | "LongAnswer" | "ShortAnswer" | "StuntPicker";
  questionGroup:
    | "review:stunt"
    | "checkpoint:stunt:visit"
    | "checkpoint:voc:enter"
    | "checkpoint:voc:exit";
  description: string;
  tickLabels: string[];
}

export interface QuestionRaw {
  id: string;
  heading: string;
  storageKey: string;
  questionFieldType: "Rating" | "LongAnswer" | "ShortAnswer" | "StuntPicker";
  questionGroup:
    | "review_stunt"
    | "checkpoint_stunt_visit"
    | "checkpoint_voc_enter"
    | "checkpoint_voc_exit";
  description: string;
  tickLabels: string[];
}
