import type { IncomingMessage, ServerResponse } from "http";
import {
  ConnectableEntity,
  EventLog,
  EventLogPersisted,
  EventLogRaw,
  EventLogRawInput,
} from "~/types";
import { makeError, nuxtConfig, simpleAllGraphQL } from ".";
import uuid4 from "uuid4";

// Converts type strings from APP types to CMS types.
const entityTypeMapping = {
  patrol: "Patrol",
  stunt: "Stunt",
  monstemonGo: "MonstemonGo",
};

export default async (req: IncomingMessage, res: ServerResponse) => {
  // Only allow POST requests.
  if (req.method !== "POST") {
    res.statusCode = 405;
    return `405 Method Not Allowed`;
  }

  // Parse request body.
  let inputData: Partial<EventLog> = {};

  if (process.env.NETLIFY === "true") {
    inputData = JSON.parse(req.body ?? "{}") ?? {};
  } else {
    inputData = await new Promise((resolve) => {
      var result: any[] = [];
      req.on("data", function (chunk) {
        console.error("RESPONSE DATA", chunk);
        result.push(chunk);
      });

      req.on("end", function () {
        console.error("RESPONSE END");
        const output = Buffer.concat(result).toString("utf8");
        resolve(JSON.parse(output));
      });
    });
  }
  console.log(inputData);

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
  const validTypes = ["stuntReview", "patrolCheckIn"];
  if (!inputData.type || !validTypes.includes(inputData.type)) {
    const error = `Event Log type is invalid ${inputData.type}`;
    return makeError(res, 400, error);
  }

  // Recording Entity
  let recordingEntity: ConnectableEntity | null = null;
  if (inputData.recordingEntity) {
    const recordingEntityType =
      entityTypeMapping[inputData.recordingEntity?._type ?? ""];

    if (!recordingEntityType) {
      const error = `Recording Entity Type Invalid ${inputData.referencedEntity?._type}`;
      return makeError(res, 400, error);
    }

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
  if (inputData.referencedEntity) {
    const referencedEntityType =
      entityTypeMapping[inputData.referencedEntity?._type ?? ""];

    if (!referencedEntityType) {
      const error = `Referenced Entity Type Invalid ${inputData.referencedEntity?._type}`;
      return makeError(res, 400, error);
    }

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
    referencedEntity: referencedEntity,
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
    ...returnable,
    data: {
      eventLog: {
        deduplicationId: returnable.data?.upsertEventLog[0].deduplicationId,
      },
    },
  };
};

// function validateDataStuntReview(data) {}
