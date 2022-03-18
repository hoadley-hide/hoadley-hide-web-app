import { AppUserEntity, Entity } from "..";

export type EventLogType =
  | "review:stunt"
  | "checkpoint:stunt:visit"
  | "checkpoint:voc:enter"
  | "checkpoint:voc:exit";

export const ValidEventLogTypes: EventLogType[] = [
  "review:stunt",
  "checkpoint:stunt:visit",
  "checkpoint:voc:enter",
  "checkpoint:voc:exit",
];

export interface EventLogAugmented {
  deduplicationId: string;
  version: string;
  hash: string;
  eventName: string;
  type: EventLogType;
  recordingEntity: AppUserEntity | null;
  referencedEntity: Entity | null;
  data: object;
  isPersisted: boolean;
}

export interface EventLog {
  deduplicationId: string;
  version: string;
  hash: string;
  eventName: string;
  type: EventLogType;
  recordingEntity: { _type: string; id: string } | null;
  referencedEntity: { _type: string; id: string } | null;
  data: object;
}

export interface EventLogRaw {
  deduplicationId: string;
  version: string;
  hash: string;
  eventName: string;
  type: EventLogType;
  recordingEntity: { _type: string; id: string } | null;
  referencedEntity: { _type: string; id: string } | null;
  data: object;
}

export interface EventLogPersisted {
  deduplicationId: string;
}

export interface EventLogPersistedRaw {
  id: string;
  deduplicationId: string;
}

export interface EventLogRawInput {
  deduplicationId: string;
  version: string;
  hash: string;
  eventName: string;
  type: EventLogType;
  recordingEntity: ConnectableEntity | null;
  recordingEntitySearchable: string | null;
  referencedEntity: ConnectableEntity | null;
  referencedEntitySearchable: string | null;
  data: object;
}

export interface ConnectableEntity {
  connect: {
    [entity in string]: {
      [whereKey in string]: any;
    };
  };
}
