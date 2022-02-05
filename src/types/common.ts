import { Admin, EventStage, MonstemonGo, Patrol, Stunt, WikiArticle } from ".";

export interface RichText {
  html: string;
  text: string;
}

export interface GraphQL<K extends string, T> {
  data?: Record<K, T>;
  errors?: { message: string }[];
  extensions?: { requestId: string };
}

export interface ScannedCode {
  code: string;
}

export type Entity =
  | Admin
  | EventStage
  | MonstemonGo
  | Patrol
  | Stunt
  | WikiArticle;
export type AppUserEntity = Admin | Patrol | Stunt;
