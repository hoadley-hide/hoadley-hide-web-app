import { RichText } from "..";

export interface Stunt {
  _type: "stunt";
  id: string;
  code: string;
  name: string;
  slug: string;
  path: string;
  icon: string;
  description: RichText;
  location: string;
  eventStageDay: "friday" | "saturday" | "sunday" | "monday";
  stuntNumber: number;
  coordinates?: Partial<{ x: number; y: number }>;
}

export interface StuntRaw {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: RichText;
  location: string;
  eventStageDay: "Friday" | "Saturday" | "Sunday" | "Monday";
  stuntNumber: number;
  coordinates?: Partial<{ x: number; y: number }>;
}
