import type { IncomingMessage, ServerResponse } from "http";
import { EventLog, EventLogRawInput, GraphQLBasic } from "~/types";
import { body2Data, simpleGraphQL } from "..";

// Converts type strings from APP types to CMS types.
const entityTypeMapping = {
  admin: "Admin",
  patrol: "Patrol",
  stunt: "Stunt",
  monsterHuntMonster: "MonsterHuntMonster",
};
export default async (req: IncomingMessage, res: ServerResponse) => {
  // Parse request body.
  // const testData = await useBody(req);
  // let inputData: Partial<EventLog> = await body2Data<EventLog>(req);
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
  res.statusCode = 200;

  return {
    data: {
      eventLog: inputData,
    },
  };
  // // console.log("testData", testData);
  // console.log("inputData", inputData);

  // // TODO: Move this logic to a common function to be validated in the UI too.
  // // Confirm there is a valid deduplication ID.
  // if (!inputData.deduplicationId || !uuid4.valid(inputData.deduplicationId)) {
  //   const error = `Event Log deduplicationId is invalid ${inputData.type}`;
  //   return makeError(res, 400, error);
  // }

  // // Confirm there is a version.
  // if (!inputData.version) {
  //   const error = `Event Log version is invalid ${inputData.type}`;
  //   return makeError(res, 400, error);
  // }

  // // Confirm there is a hash.
  // if (!inputData.hash) {
  //   const error = `Event Log hash is invalid ${inputData.type}`;
  //   return makeError(res, 400, error);
  // }

  // // Confirm the event name matches what we expect.
  // const expectedEventName = nuxtConfig.RUNTIME_CONFIG.public.eventName;
  // if (!inputData.eventName || inputData.eventName !== expectedEventName) {
  //   const error = `Event Log name is invalid ${inputData.type}`;
  //   return makeError(res, 400, error);
  // }

  // // Confirm the log type matches a valid type.
  // if (!inputData.type || !ValidEventLogTypes.includes(inputData.type)) {
  //   const error = `Event Log type is invalid ${inputData.type}`;
  //   return makeError(res, 400, error);
  // }

  // // Recording Entity
  // let recordingEntity: ConnectableEntity | null = null;
  // let recordingEntitySearchable: string | null = null;
  // if (inputData.recordingEntity) {
  //   const recordingEntityType =
  //     entityTypeMapping[inputData.recordingEntity?._type ?? ""];

  //   if (!recordingEntityType) {
  //     const error = `Recording Entity Type Invalid ${inputData.recordingEntity?._type}`;
  //     return makeError(res, 400, error);
  //   }

  //   recordingEntitySearchable = `${inputData.recordingEntity._type}:${inputData.recordingEntity.id}`;
  //   recordingEntity = {
  //     connect: {
  //       [recordingEntityType]: {
  //         id: inputData.recordingEntity.id,
  //       },
  //     },
  //   };
  // }

  // // Referenced Entity
  // let referencedEntity: ConnectableEntity | null = null;
  // let referencedEntitySearchable: string | null = null;
  // if (inputData.referencedEntity) {
  //   const referencedEntityType =
  //     entityTypeMapping[inputData.referencedEntity?._type ?? ""];

  //   if (!referencedEntityType) {
  //     const error = `Referenced Entity Type Invalid ${inputData.referencedEntity?._type}`;
  //     return makeError(res, 400, error);
  //   }

  //   referencedEntitySearchable = `${inputData.referencedEntity._type}:${inputData.referencedEntity.id}`;
  //   referencedEntity = {
  //     connect: {
  //       [referencedEntityType]: {
  //         id: inputData.referencedEntity.id,
  //       },
  //     },
  //   };
  // }

  // const logData: EventLogRawInput = {
  //   deduplicationId: inputData.deduplicationId,
  //   version: inputData.version,
  //   hash: inputData.hash,
  //   eventName: inputData.eventName,
  //   type: inputData.type,
  //   recordingEntity: recordingEntity,
  //   recordingEntitySearchable: recordingEntitySearchable,
  //   referencedEntity: referencedEntity,
  //   referencedEntitySearchable: referencedEntitySearchable,
  //   data: inputData.data ?? {},
  // };

  // const isLatest = await isLatestMessage(logData);

  // if (!isLatest.data) {
  //   res.statusCode = 500;
  //   return {
  //     errors: isLatest.errors,
  //     extensions: isLatest.extensions,
  //   };
  // }

  // if (isLatest.data.isLatest === false) {
  //   // There are logs which are newer than my current version
  //   // We should assume this log is redundant and should not be processed.

  //   res.statusCode = 200;
  //   return {
  //     data: {
  //       eventLog: {
  //         deduplicationId: logData.deduplicationId,
  //       },
  //     },
  //   };
  // }

  // const query = `mutation (
  //   $where: EventLogWhereUniqueInput!,
  //   $create: EventLogCreateInput!,
  //   $update: EventLogUpdateInput!
  // ) {
  //   upsertEventLog(
  //     where: $where,
  //     upsert: {
  //       create: $create,
  //       update: $update
  //     }
  //   ) {
  //     id,
  //     deduplicationId
  //   }
  //   publishEventLog(where:$where) {
  //     id
  //   }
  // }
  // `;

  // const response = await simpleGraphQL<{ upsertEventLog: EventLogRaw }>(query, {
  //   where: {
  //     deduplicationId: logData.deduplicationId,
  //   },
  //   create: logData,
  //   update: logData,
  // });

  // if (!response.data) {
  //   res.statusCode = 500;
  //   return {
  //     errors: response.errors,
  //     extensions: response.extensions,
  //   };
  // }

  // res.statusCode = 200;
  // return {
  //   data: {
  //     eventLog: {
  //       deduplicationId: response.data.upsertEventLog.deduplicationId,
  //     },
  //   },
  // };
};

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
