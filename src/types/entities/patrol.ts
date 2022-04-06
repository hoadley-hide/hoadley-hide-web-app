export interface PatrolMember {
  rego?: string;
  fullname: string;
  formation: string;
}

export interface Patrol {
  _type: "patrol";
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

export interface PatrolInput {
  _type: "patrol";
  name: string;
  patrolNumber: string;
  members: PatrolMemberInput[];
}

export interface PatrolMemberInput {
  rego?: string;
  fullname: string;
  formation: string;
}
