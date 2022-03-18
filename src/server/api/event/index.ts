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
};
export default async (req: IncomingMessage, res: ServerResponse) => {
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
    }
    referencedEntity {
      _type: __typename
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
    res.statusCode = 200;
    return {
      errors: returnable.errors,
      extensions: returnable.extensions,
    };
  }

  let returnAllResults = false;

  if (query.from && query.diff) {
    const eventsBeforeTimestamp = returnable.data.eventLogs.filter(
      (log) => Date.parse(log.version) < Date.parse(query.from)
    );

    const serverSideHashHash = hasher(
      eventsBeforeTimestamp.map((log: EventLog) => log.hash),
      { unorderedArrays: true }
    );

    if (serverSideHashHash !== query.diff) {
      // Hashes do not match, client data does not match server's
      returnAllResults = true;
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
};
