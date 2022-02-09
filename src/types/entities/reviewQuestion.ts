export interface ReviewQuestion {
  _type: "reviewQuestion";
  id: string;
  heading: string;
  storageKey: string;
  description: string;
  tickLabels: string[];
}

export interface ReviewQuestionRaw {
  id: string;
  heading: string;
  storageKey: string;
  description: string;
  tickLabels: string[];
}
