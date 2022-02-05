import { Admin, EventStage, MonstemonGo, Patrol, Stunt, WikiArticle } from ".";

export type Entity =
  | Admin
  | EventStage
  | MonstemonGo
  | Patrol
  | Stunt
  | WikiArticle;
export type AppUserEntity = Admin | Patrol | Stunt;
