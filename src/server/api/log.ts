import type { IncomingMessage, ServerResponse } from "http";
import { EventLog, EventLogPersisted, EventLogRaw } from "~/types";
import {
  EntityType,
  generateCode,
  nuxtConfig,
  simpleAllGraphQL,
  streamData,
} from ".";

export default async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== "POST") {
    res.statusCode = 404;
    return {
      errors: [
        { message: "404 Not Found", extensions: { requestId: "000404" } },
      ],
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
  }
  `;

  const logData = await streamData<Partial<EventLog>>(req);

  const requiredKeys = [
    "deduplicationId",
    "eventName",
    "type",
    "recordingEntity",
    "referencedEntity",
  ];

  if (Object.keys(logData).sort() !== requiredKeys.sort()) {
    res.statusCode = 400;
    return {
      errors: [
        {
          message: "400 Bad Request",
          extensions: {
            name: "Missing keys from request",
            requestId: "000400",
          },
        },
      ],
    };
  }

  const returnable = await simpleAllGraphQL<EventLogRaw, EventLogPersisted>(
    "upsertEventLog",
    query,
    {
      where: {
        deduplicationId: logData.deduplicationId,
      },
      create: logData,
      update: logData,
    },
    (eventLog): EventLogPersisted => ({
      deduplicationId: eventLog.deduplicationId,
    })
  );

  res.statusCode = 200;
  return {
    data: {
      eventLog: {
        deduplicationId: returnable.data?.upsertEventLog[0].deduplicationId,
      },
    },
  };
};
