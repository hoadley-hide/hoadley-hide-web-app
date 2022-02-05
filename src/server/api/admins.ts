import type { IncomingMessage, ServerResponse } from "http";
import { Admin, AdminRaw } from "~/types";
import { EntityType, generateCode, simpleAllGraphQL } from ".";

export default async (_req: IncomingMessage, res: ServerResponse) => {
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
      path: `/admins/${admin.slug}`,
      permissions: admin.permissions,
    })
  );

  res.statusCode = 200;
  return returnable;
};
