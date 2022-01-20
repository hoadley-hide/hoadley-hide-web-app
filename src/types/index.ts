export interface EventStage {
  id: string;
  code: string;
  name: string;
  slug: string;
  path: string;
  description: string;
  descriptionText: string;
  startTime: string;
}

export interface EventStageRaw {
  id: string;
  name: string;
  slug: string;
  description: {
    html: string;
    text: string;
  };
  startTime: string;
}

export interface Stunt {
  id: string;
  code: string;
  name: string;
  slug: string;
  path: string;
  icon: string;
  description: string;
  descriptionText: string;
  location: string;
}

export interface StuntRaw {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: {
    html: string;
    text: string;
  };
  location: string;
}

export interface PatrolMember {
  rego?: string;
  fullname: string;
  formation: string;
}

export interface Patrol {
  id: string;
  code: string;
  name: string;
  slug: string;
  path: string;
  patrolNumber: string;
  members: PatrolMember[];
}

export interface PatrolMemberRaw {
  rego?: string;
  fullname: string;
  formation: string;
}

export interface PatrolRaw {
  id: string;
  name: string;
  slug: string;
  patrolNumber: string;
  members: PatrolMemberRaw[];
}

export interface WikiArticle {
  id: string;
  code: string;
  name: string;
  shortName: string;
  slug: string;
  path: string;
  content: string;
  contentText: string;
  tags: string[];
}

export interface WikiArticleRaw {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  content: {
    html: string;
    text: string;
  };
  tags: string[];
}

export interface GraphQL<K extends string, T> {
  data?: Record<K, T>;
  errors?: { message: string }[];
  extensions?: { requestId: string };
}

export interface ScannedCode {
  code: string;
}

export type AppUserType = "patrol" | "stunt" | "admin";
export interface AppUser {
  id: string;
  _type: AppUserType;
  code: string;
  name: string;
}

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
