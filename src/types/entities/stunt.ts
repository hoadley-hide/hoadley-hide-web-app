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
  stuntNumber: number;
}

export interface StuntRaw {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: RichText;
  location: string;
  stuntNumber: number;
}
