import { RichText, ScannedCode } from "..";

export interface MonsterHuntMonster {
  _type: "monsterHuntMonster";
  id: string;
  code: string;
  name: string;
  slug: string;
  path: string;
  description: RichText;
  clues: RichText[];
}

export interface MonsterHuntMonsterRaw {
  id: string;
  name: string;
  slug: string;
  description: RichText;
  clues: RichText[];
}

export interface MonsterHuntPlayer {
  _type: "monsterHuntPlayer";
  id: string;
  name: string;
  rego: string;
  timeStarted: Date;
}

export interface MonsterHuntMonsterIssuedStored {
  by: MonsterHuntMonster | null;
  for: MonsterHuntMonster;
}

export interface MonsterHuntMonsterIssued {
  monster: MonsterHuntMonster;
  scanned: ScannedCode;
}
