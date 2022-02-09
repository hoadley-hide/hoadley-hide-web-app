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
}

export interface StuntRaw {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: RichText;
  location: string;
}
