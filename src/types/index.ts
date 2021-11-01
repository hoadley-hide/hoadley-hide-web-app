export interface EventStage {
  id: string;
  shortId: string;
  name: string;
  slug: string;
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
  shortId: string;
  name: string;
  slug: string;
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

export interface GraphQL<K extends string, T> {
  data?: Record<K, T>;
  errors?: { message: string }[];
  extensions?: { requestId: string };
}

export interface ScannedCode {
  code: string;
}
