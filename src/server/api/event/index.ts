import { useQuery } from "h3";
import type { IncomingMessage, ServerResponse } from "http";
import uuid4 from "uuid4";
import hasher from "object-hash";
import {
  ConnectableEntity,
  EventLog,
  EventLogRaw,
  EventLogRawInput,
  GraphQLBasic,
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
  walkpoint: "Walkpoint",
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
    version
    hash
    eventName
    type
    recordingEntity {
      _type: __typename
      ... on Admin { id }
      ... on MonsterHuntMonster { id }
      ... on Patrol { id }
      ... on Stunt { id }
      ... on Walkpoint { id }
    }
    referencedEntity {
      _type: __typename
      ... on MonsterHuntMonster { id }
      ... on Patrol { id }
      ... on Stunt { id }
      ... on Walkpoint { id }
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
        OR: [
          {
            recordingEntitySearchable: query.user,
          },
          {
            referencedEntitySearchable: query.user,
          },
        ],
      },
    },
    (log): EventLog => ({
      deduplicationId: log.deduplicationId,
      version: log.version,
      hash: log.hash,
      eventName: log.eventName,
      type: log.type,
      recordingEntity: log.recordingEntity,
      referencedEntity: log.referencedEntity,
      data: log.data,
    })
  );

  if (!returnable.data) {
    return {
      errors: returnable.errors,
      extensions: returnable.extensions,
    };
  }

  let returnAllResults = true;

  if (query.from && query.diff) {
    const eventsBeforeTimestamp = returnable.data.eventLogs.filter(
      (log) => Date.parse(log.version) <= Date.parse(query.from)
    );

    const serverSideHashHash = hasher(
      eventsBeforeTimestamp.map((log: EventLog) => log.hash),
      { unorderedArrays: true }
    );

    console.log("serverHash", serverSideHashHash);
    console.log("clientHash", query.diff);

    // console.log(eventsBeforeTimestamp.map((log: EventLog) => log.hash));

    if (serverSideHashHash === query.diff) {
      // Hashes match, client data matchs server's
      returnAllResults = false;
    }
  }

  const eventLogs =
    returnAllResults || !query.from
      ? returnable.data.eventLogs
      : returnable.data.eventLogs.filter(
          (log) => Date.parse(log.version) > Date.parse(query.from)
        );

  res.statusCode = 200;
  return {
    data: {
      eventLogs: eventLogs,
      allResultsReturned: returnAllResults,
    },
  };
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

  // Confirm there is a version.
  if (!inputData.version) {
    const error = `Event Log version is invalid ${inputData.type}`;
    return makeError(res, 400, error);
  }

  // Confirm there is a hash.
  if (!inputData.hash) {
    const error = `Event Log hash is invalid ${inputData.type}`;
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
    version: inputData.version,
    hash: inputData.hash,
    eventName: inputData.eventName,
    type: inputData.type,
    recordingEntity: recordingEntity,
    recordingEntitySearchable: recordingEntitySearchable,
    referencedEntity: referencedEntity,
    referencedEntitySearchable: referencedEntitySearchable,
    data: inputData.data ?? {},
  };

  const isLatest = await isLatestMessage(logData);

  if (!isLatest.data) {
    res.statusCode = 500;
    return {
      errors: isLatest.errors,
      extensions: isLatest.extensions,
    };
  }

  if (isLatest.data.isLatest === false) {
    // There are logs which are newer than my current version
    // We should assume this log is redundant and should not be processed.

    res.statusCode = 200;
    return {
      data: {
        eventLog: {
          deduplicationId: logData.deduplicationId,
        },
      },
    };
  }

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
    res.statusCode = 500;
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

async function isLatestMessage(
  logData: EventLogRawInput
): Promise<GraphQLBasic<{ isLatest: boolean }>> {
  const query = `query($where: EventLogWhereInput!) {
    eventLogs(where: $where) {
      deduplicationId
      version
    }
  }`;

  // Get log events which are newer than the current data.
  const response = await simpleGraphQL<{
    eventLogs: { deduplicationId: string; version: string }[];
  }>(query, {
    where: {
      deduplicationId: logData.deduplicationId,
      version_gt: logData.version, // "2022-03-17T04:05:56+00:00",
    },
  });

  if (!response.data) {
    return {
      errors: response.errors,
      extensions: response.extensions,
    };
  }

  if (response.data.eventLogs?.length > 0) {
    // There are logs which are newer than my current version
    // We should assume this log is redundant and should not be processed.
    return { data: { isLatest: false } };
  }

  return { data: { isLatest: true } };
}
