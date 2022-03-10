import { useQuery } from "h3";
import type { IncomingMessage, ServerResponse } from "http";
import uuid4 from "uuid4";
import {
  ConnectableEntity,
  EventLog,
  EventLogRaw,
  EventLogRawInput,
  ValidEventLogTypes,
} from "~/types";
import {
  body2Data,
  makeError,
  nuxtConfig,
  simpleAllGraphQL,
  simpleGraphQL,
} from "..";

// Converts type strings from APP types to CMS types.
const entityTypeMapping = {
  admin: "Admin",
  patrol: "Patrol",
  stunt: "Stunt",
  monsterHuntMonster: "MonsterHuntMonster",
};
export default async (req: IncomingMessage, res: ServerResponse) => {
  switch (req.method) {
    case "GET":
      return await handleGet(req, res);
    case "POST":
      return await handlePost(req, res);

    default:
      res.statusCode = 405;
      return `405 Method Not Allowed`;
  }
};

async function handleGet(req: IncomingMessage, res: ServerResponse) {
  const query = useQuery(req);

  console.log(query);

  if (!query.user) {
    res.statusCode = 405;
    return `400 Bad Request`;
  }

  const fields = `{
    deduplicationId
    eventName
    type
    recordingEntity {
      __typename
      ... on Admin { id }
      ... on MonsterHuntMonster { id }
      ... on Patrol { id }
      ... on Stunt { id }
    }
    referencedEntity {
      __typename
      ... on MonsterHuntMonster { id }
      ... on Patrol { id }
      ... on Stunt { id }
    }
    data
  }`;

  const returnable = await simpleAllGraphQL<EventLogRaw, EventLog>(
    "eventLogs",
    `query($where: EventLogWhereInput!) {
      eventLogs(where:$where) ${fields}
    }`,
    {
      where: {
        type: "review:stunt",
        recordingEntitySearchable: query.user,
      },
    },
    (log): EventLog => ({
      deduplicationId: log.deduplicationId,
      eventName: log.eventName,
      type: log.type,
      recordingEntity: log.recordingEntity,
      referencedEntity: log.referencedEntity,
      data: log.data,
    })
  );

  res.statusCode = 200;
  return returnable;
}

async function handlePost(req: IncomingMessage, res: ServerResponse) {
  // Parse request body.
  // const testData = await useBody(req);
  let inputData: Partial<EventLog> = await body2Data<EventLog>(req);

  // console.log("testData", testData);
  console.log("inputData", inputData);

  // TODO: Move this logic to a common function to be validated in the UI too.
  // Confirm there is a valid deduplication ID.
  if (!inputData.deduplicationId || !uuid4.valid(inputData.deduplicationId)) {
    const error = `Event Log deduplicationId is invalid ${inputData.type}`;
    return makeError(res, 400, error);
  }

  // Confirm the event name matches what we expect.
  const expectedEventName = nuxtConfig.RUNTIME_CONFIG.public.eventName;
  if (!inputData.eventName || inputData.eventName !== expectedEventName) {
    const error = `Event Log name is invalid ${inputData.type}`;
    return makeError(res, 400, error);
  }

  // Confirm the log type matches a valid type.
  if (!inputData.type || !ValidEventLogTypes.includes(inputData.type)) {
    const error = `Event Log type is invalid ${inputData.type}`;
    return makeError(res, 400, error);
  }

  // Recording Entity
  let recordingEntity: ConnectableEntity | null = null;
  let recordingEntitySearchable: string | null = null;
  if (inputData.recordingEntity) {
    const recordingEntityType =
      entityTypeMapping[inputData.recordingEntity?._type ?? ""];

    if (!recordingEntityType) {
      const error = `Recording Entity Type Invalid ${inputData.recordingEntity?._type}`;
      return makeError(res, 400, error);
    }

    recordingEntitySearchable = `${inputData.recordingEntity._type}:${inputData.recordingEntity.id}`;
    recordingEntity = {
      connect: {
        [recordingEntityType]: {
          id: inputData.recordingEntity.id,
        },
      },
    };
  }

  // Referenced Entity
  let referencedEntity: ConnectableEntity | null = null;
  let referencedEntitySearchable: string | null = null;
  if (inputData.referencedEntity) {
    const referencedEntityType =
      entityTypeMapping[inputData.referencedEntity?._type ?? ""];

    if (!referencedEntityType) {
      const error = `Referenced Entity Type Invalid ${inputData.referencedEntity?._type}`;
      return makeError(res, 400, error);
    }

    referencedEntitySearchable = `${inputData.referencedEntity._type}:${inputData.referencedEntity.id}`;
    referencedEntity = {
      connect: {
        [referencedEntityType]: {
          id: inputData.referencedEntity.id,
        },
      },
    };
  }

  const logData: EventLogRawInput = {
    deduplicationId: inputData.deduplicationId,
    eventName: inputData.eventName,
    type: inputData.type,
    recordingEntity: recordingEntity,
    recordingEntitySearchable: recordingEntitySearchable,
    referencedEntity: referencedEntity,
    referencedEntitySearchable: referencedEntitySearchable,
    data: inputData.data ?? {},
  };

  const query = `mutation (
    $where: EventLogWhereUniqueInput!,
    $create: EventLogCreateInput!,
    $update: EventLogUpdateInput!
  ) {
    upsertEventLog(
      where: $where,
      upsert: {
        create: $create,
        update: $update
      }
    ) {
      id,
      deduplicationId
    }
    publishEventLog(where:$where) {
      id
    }
  }
  `;

  const response = await simpleGraphQL<{ upsertEventLog: EventLogRaw }>(query, {
    where: {
      deduplicationId: logData.deduplicationId,
    },
    create: logData,
    update: logData,
  });

  if (!response.data) {
    return {
      errors: response.errors,
      extensions: response.extensions,
    };
  }

  res.statusCode = 200;
  return {
    data: {
      eventLog: {
        deduplicationId: response.data.upsertEventLog.deduplicationId,
      },
    },
  };
}

// function validateDataStuntReview(data) {}
