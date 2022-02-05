import { RichText } from "..";

export interface MonstemonGo {
  _type: "monstemonGo";
  id: string;
  code: string;
  name: string;
  slug: string;
  path: string;
  description: RichText;
  location: { latitude: number; longitude: number };
}

export interface MonstemonGoRaw {
  id: string;
  name: string;
  slug: string;
  description: RichText;
  location: { latitude: number; longitude: number };
}
