import type { IncomingMessage, ServerResponse } from "http";
import { Patrol, PatrolInput, PatrolRaw } from "~/types";
import {
  body2Data,
  EntityType,
  generateCode,
  makeError,
  simpleAllGraphQL,
  simpleGraphQL,
} from ".";

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

const fields = `{
  id
  name
  patrolNumber
  slug
  members
}`;

const patrolRawToData = (patrol): Patrol => ({
  _type: "patrol",
  id: patrol.id,
  code: generateCode(EntityType.Patrol, patrol.id),
  name: patrol.name,
  slug: patrol.slug,
  path: `/patrols/${patrol.slug}`,
  patrolNumber: patrol.patrolNumber,
  members:
    patrol.members
      ?.map((m) => ({
        fullname: m.fullname,
        formation: m.formation,
      }))
      .sort((a, b) => a.fullname.localeCompare(b.fullname)) ?? [],
});

async function handleGet(req: IncomingMessage, res: ServerResponse) {
  const returnable = await simpleAllGraphQL<PatrolRaw, Patrol>(
    "patrols",
    `{ patrols ${fields} }`,
    {},
    patrolRawToData
  );

  res.statusCode = 200;
  return returnable;
}

async function handlePost(req: IncomingMessage, res: ServerResponse) {
  // Parse request body.
  // const testData = await useBody(req);
  let inputData: Partial<PatrolInput> = await body2Data<PatrolInput>(req);

  // TODO: Move this logic to a common function to be validated in the UI too.
  // Confirm there is a valid deduplication ID.
  if (!inputData.patrolNumber) {
    const error = `Patrol patrolNumber is invalid`;
    return makeError(res, 400, error);
  }

  // Confirm there is a name.
  if (!inputData.name) {
    const error = `Patrol name is invalid`;
    return makeError(res, 400, error);
  }

  // Confirm there is a list of members.
  if (!inputData.members) {
    const error = `Patrol members is invalid`;
    return makeError(res, 400, error);
  }

  for (const member of inputData.members) {
    // Confirm there is a fullname.
    if (!member.fullname) {
      const error = `Patrol member fullname is invalid`;
      return makeError(res, 400, error);
    }

    // Confirm there is a formation.
    if (!member.formation) {
      const error = `Patrol member formation is invalid`;
      return makeError(res, 400, error);
    }
  }

  const logData: Omit<PatrolInput, "_type"> & { slug: string } = {
    slug: inputData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/--/g, "-"),
    name: inputData.name,
    patrolNumber: inputData.patrolNumber,
    members: inputData.members.map((m) => ({
      fullname: m.fullname,
      formation: m.formation,
    })),
  };

  const query = `mutation (
    $where: PatrolWhereUniqueInput!,
    $create: PatrolCreateInput!,
    $update: PatrolUpdateInput!
  ) {
    upsertPatrol(
      where: $where,
      upsert: {
        create: $create,
        update: $update
      }
    ) ${fields}
    publishPatrol(where:$where) {
      id
    }
  }
  `;

  const response = await simpleGraphQL<{ upsertPatrol: PatrolRaw }>(query, {
    where: {
      patrolNumber: logData.patrolNumber,
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
      patrol: patrolRawToData(response.data.upsertPatrol),
    },
  };
}
