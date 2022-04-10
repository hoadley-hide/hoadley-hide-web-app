import {
  Admin,
  EventStage,
  MonsterHuntMonster,
  MonsterHuntPlayer,
  Patrol,
  Stunt,
  WikiArticle,
} from ".";
import { Walkpoint } from "./entities/walkpoint";

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
  | Walkpoint
  | WikiArticle;
export type AppUserEntity = Admin | MonsterHuntPlayer | Patrol | Stunt;
export type QrCodeableEntity =
  | Admin
  | EventStage
  | MonsterHuntMonster
  | Patrol
  | Stunt
  | Walkpoint;
export type PermissionScope =
  | "app:seeDashboard"
  | "app:seeDev"
  | "app:seeEmergencyInfo"
  | "app:seePrintingList"
  | "app:seeReviewList" // Deprecated
  | "checkpoint:seeOthers"
  | "eventStage:seeAll"
  | "monsterHunt:canShare"
  | "monsterHunt:seeAll"
  | "patrol:canCheckpoint:stunt:visit"
  | "patrol:canCheckpoint:voc:enter"
  | "patrol:canCheckpoint:voc:exit"
  | "patrol:canCheckpoint:walkpoint:capture"
  | "patrol:canShare"
  | "patrol:import"
  | "patrol:seeAll"
  | "review:canDelete"
  | "review:seeAll"
  | "review:seeOthers"
  | "review:seeRecordedBySelf"
  | "review:seeReferencingSelf"
  | "stunt:canReview"
  | "stunt:canShare"
  | "stunt:seeAll"
  | "walkpoint:seeAll";
