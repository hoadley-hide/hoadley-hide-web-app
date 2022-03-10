import type { IncomingMessage, ServerResponse } from "http";
import { EventLogPersistedRaw } from "~/types";
import { simpleGraphQL } from "..";
import uuid4 from "uuid4";

export default async (req: IncomingMessage, res: ServerResponse) => {
  // Only allow POST requests.
  if (req.method !== "DELETE") {
    res.statusCode = 405;
    return `405 Method Not Allowed`;
  }

  // Remove the leading `/` from the url components provided.
  // Full request path:
  // /api/log/_id/uuid-uuid
  //             ^^^^^^^^^^ -> req.url
  //              ^^^^^^^^^ -> logId
  const logId = req.url ? req.url.toLowerCase().substring(1) : null;

  if (!logId || !uuid4.valid(logId)) {
    res.statusCode = 400;
    return `400 Bad Request`;
  }

  const query = `mutation (
    $where: EventLogWhereUniqueInput!,
  ) {
    deleteEventLog(where: $where) {
      id,
      deduplicationId
    }
  }
  `;

  interface RawData {
    deleteEventLog: EventLogPersistedRaw;
  }

  const response = await simpleGraphQL<RawData>(query, {
    where: {
      deduplicationId: logId,
    },
  });

  if (response.data?.deleteEventLog !== null) {
    return {
      errors: response.errors,
      extensions: response.extensions,
    };
  }

  res.statusCode = 200;
  return {
    data: {
      eventLog: {
        deduplicationId: logId,
      },
    },
  };
};
