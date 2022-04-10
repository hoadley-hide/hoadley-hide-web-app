import { RichText } from "..";

export interface Walkpoint {
  _type: "walkpoint";
  id: string;
  code: string;
  name: string;
  slug: string;
  path: string;
  icon: string;
  description: RichText;
  eventStageDay: "friday" | "saturday" | "sunday" | "monday";
  walkpointLetter: string;
  coordinates?: Partial<{ x: number; y: number }>;
}

export interface WalkpointRaw {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: RichText;
  eventStageDay: "Friday" | "Saturday" | "Sunday" | "Monday";
  walkpointLetter: string;
  coordinates?: Partial<{ x: number; y: number }>;
}
