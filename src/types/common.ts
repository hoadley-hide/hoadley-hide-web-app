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

export interface GraphQLBasic<T extends Record<string, any>> {
  data?: T;
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
  | "app:seeDashboard"
  | "app:seeDev"
  | "app:seePrintingList"
  | "app:seeReviewList" // Deprecated
  | "app:seeEmergencyInfo"
  | "monsterHunt:canShare"
  | "monsterHunt:seeAll"
  | "eventStage:seeAll"
  | "patrol:canCheckpoint:stunt:visit"
  | "patrol:canCheckpoint:voc:enter"
  | "patrol:canCheckpoint:voc:exit"
  | "patrol:import"
  | "patrol:seeAll"
  | "patrol:canShare"
  | "stunt:canReview"
  | "stunt:canShare"
  | "stunt:seeAll"
  | "review:seeRecordedBySelf"
  | "review:seeReferencingSelf"
  | "review:canDelete"
  | "review:seeAll";
