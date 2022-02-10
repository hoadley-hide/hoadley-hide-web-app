export interface EventLog {
  deduplicationId: string;
  eventName: string;
  type: "stuntReview" | "patrolCheckIn";
  recordingEntity: { _type: string; id: string };
  referencedEntity: { _type: string; id: string };
  data: object;
}

export interface EventLogRaw {
  deduplicationId: string;
  eventName: string;
  type: "stuntReview" | "patrolCheckIn";
  recordingEntity: { _type: string; id: string };
  referencedEntity: { _type: string; id: string };
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
  eventName: string;
  type: "stuntReview" | "patrolCheckIn";
  recordingEntity: ConnectableEntity | null;
  referencedEntity: ConnectableEntity | null;
  data: object;
}

export interface ConnectableEntity {
  connect: {
    [entity in string]: {
      [whereKey in string]: any;
    };
  };
}
