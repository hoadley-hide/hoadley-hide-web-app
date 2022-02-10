export interface EventLog {
  deduplicationId: string;
  eventName: string;
  type: string;
  recordingEntityId: string;
  referencedEntityId: string;
  data: null;
}

export interface EventLogPersisted {
  deduplicationId: string;
}

export interface EventLogRaw {
  deduplicationId: string;
  eventName: string;
  type: string;
  recordingEntity: null;
  referencedEntity: null;
  data: null;
}
