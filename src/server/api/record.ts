import type { IncomingMessage, ServerResponse } from "http";
import {
  Admin,
  AdminRaw,
  ConnectableEntity,
  EventLog,
  EventLogPersisted,
  EventLogRaw,
  EventLogRawInput,
  ValidEventLogTypes,
} from "~/types";
import {
  EntityType,
  generateCode,
  makeError,
  nuxtConfig,
  simpleAllGraphQL,
} from ".";
// import uuid4 from "uuid4";

// Converts type strings from APP types to CMS types.
const entityTypeMapping = {
  patrol: "Patrol",
  stunt: "Stunt",
  monstemonGo: "MonstemonGo",
};

export default async (req: IncomingMessage, res: ServerResponse) => {
  // Only allow POST requests.
  // if (req.method !== "POST") {
  //   res.statusCode = 405;
  //   return `405 Method Not Allowed`;
  // }

  const fields = `{
    id
    name
    slug
    permissions
  }`;

  const returnable = await simpleAllGraphQL<AdminRaw, Admin>(
    "admins",
    `{ admins ${fields} }`,
    {},
    (admin): Admin => ({
      _type: "admin",
      id: admin.id,
      code: generateCode(EntityType.Admin, admin.id),
      name: admin.name,
      slug: admin.slug,
      path: `/`,
      permissions: admin.permissions,
    })
  );

  res.statusCode = 200;
  return returnable;

  // // Parse request body.
  // let inputData: Partial<EventLog> = {};

  // if (process.env.NETLIFY === "true") {
  //   inputData = JSON.parse(req.body ?? "{}") ?? {};
  // } else {
  //   inputData = await new Promise((resolve) => {
  //     var result: any[] = [];
  //     req.on("data", function (chunk) {
  //       console.error("RESPONSE DATA", chunk);
  //       result.push(chunk);
  //     });

  //     req.on("end", function () {
  //       console.error("RESPONSE END");
  //       const output = Buffer.concat(result).toString("utf8");
  //       resolve(JSON.parse(output));
  //     });
  //   });
  // }
  // console.log(inputData);

  // // Confirm there is a valid deduplication ID.
  // if (!inputData.deduplicationId || !uuid4.valid(inputData.deduplicationId)) {
  //   const error = `Event Log deduplicationId is invalid ${inputData.type}`;
  //   return makeError(res, 400, error);
  // }

  // // Confirm there is a valid version.
  // if (!inputData.version) {
  //   const error = `Event Log version is invalid ${inputData.type}`;
  //   return makeError(res, 400, error);
  // }

  // // Confirm there is a valid hash.
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
  // let recordingEntitySearchable: string | null = null;
  // let recordingEntity: ConnectableEntity | null = null;
  // if (inputData.recordingEntity) {
  //   const recordingEntityType =
  //     entityTypeMapping[inputData.recordingEntity?._type ?? ""];

  //   if (!recordingEntityType) {
  //     const error = `Recording Entity Type Invalid ${inputData.referencedEntity?._type}`;
  //     return makeError(res, 400, error);
  //   }

  //   recordingEntitySearchable = `${inputData.referencedEntity?._type}:${inputData.referencedEntity?.id}`;
  //   recordingEntity = {
  //     connect: {
  //       [recordingEntityType]: {
  //         id: inputData.recordingEntity.id,
  //       },
  //     },
  //   };
  // }

  // // Referenced Entity
  // let referencedEntitySearchable: string | null = null;
  // let referencedEntity: ConnectableEntity | null = null;
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

  // const returnable = await simpleAllGraphQL<EventLogRaw, EventLogPersisted>(
  //   "upsertEventLog",
  //   query,
  //   {
  //     where: {
  //       deduplicationId: logData.deduplicationId,
  //     },
  //     create: logData,
  //     update: logData,
  //   },
  //   (eventLog): EventLogPersisted => ({
  //     deduplicationId: eventLog.deduplicationId,
  //   })
  // );

  // res.statusCode = 200;
  // return {
  //   ...returnable,
  //   data: {
  //     eventLog: {
  //       deduplicationId: returnable.data?.upsertEventLog[0].deduplicationId,
  //     },
  //   },
  // };
};

// function validateDataStuntReview(data) {}
