export interface EventStage {
  name: string;
  description: string;
}

export interface EventStageRaw {
  name: string;
  description: {
    html: string;
  };
}

export interface Stunt {
  name: string;
  icon: string;
  description: string;
}

export interface StuntRaw {
  name: string;
  icon: string;
  description: {
    html: string;
  };
}

export interface GraphQL<K extends string, T> {
  data?: Record<K, T>;
  errors?: { message: string }[];
  extensions?: { requestId: string };
}
