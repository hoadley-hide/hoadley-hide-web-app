export * from "./common";
export * from "./entities/admin";
export * from "./entities/eventStage";
export * from "./entities/monstemonGo";
export * from "./entities/patrol";
export * from "./entities/stunt";
export * from "./entities/wikiArticle";

export interface GraphQL<K extends string, T> {
  data?: Record<K, T>;
  errors?: { message: string }[];
  extensions?: { requestId: string };
}

export interface ScannedCode {
  code: string;
}

// export type AppUserType = "patrol" | "stunt" | "admin";
// export interface AppUser {
//   id: string;
//   _type: AppUserType;
//   code: string;
//   name: string;
// }

interface QrCodeLookupBase {
  code: string;
}

export interface QrCodeLookupStage extends QrCodeLookupBase {
  _type: "stage";
  stage: EventStage;
}

export interface QrCodeLookupStunt extends QrCodeLookupBase {
  _type: "stunt";
  stunt: Stunt;
}

export interface QrCodeLookupPatrol extends QrCodeLookupBase {
  _type: "patrol";
  patrol: Patrol;
}

export interface QrCodeLookupWikiArticle extends QrCodeLookupBase {
  _type: "wiki";
  wikiArticle: WikiArticle;
}

export type QrCodeLookup =
  | QrCodeLookupStage
  | QrCodeLookupStunt
  | QrCodeLookupPatrol
  | QrCodeLookupWikiArticle;
