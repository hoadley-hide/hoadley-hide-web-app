import {
  Admin,
  EventStage,
  MonsterHuntMonster,
  MonsterHuntPlayer,
  Patrol,
  Stunt,
  WikiArticle,
} from ".";

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
  time: string;
  code: string;
}

export interface CodeEntity {
  code: string;
  path: string;
  name: string;
}

export type Entity =
  | Admin
  | EventStage
  | MonsterHuntMonster
  | MonsterHuntPlayer
  | Patrol
  | Stunt
  | WikiArticle;
export type AppUserEntity = Admin | MonsterHuntPlayer | Patrol | Stunt;
export type QrCodeableEntity =
  | Admin
  | EventStage
  | MonsterHuntMonster
  | Patrol
  | Stunt;
export type PermissionScope =
  | "app:seePrintingList"
  | "authenticated"
  | "monsterHunt:canShare"
  | "monsterHunt:seeAll"
  | "eventStage:seeAll"
  | "patrol:canCheckIn"
  | "patrol:canScore"
  | "patrol:seeAll"
  | "stunt:canReview"
  | "stunt:canShare"
  | "stunt:seeAll"
  | "review:seeRecordedBySelf"
  | "review:seeReferencingSelf"
  | "review:seeAll";
