export interface Admin {
  _type: "admin";
  id: string;
  code: string;
  name: string;
  slug: string;
  path: string;
  permissions: Partial<AdminPermissions>;
}

export interface AdminRaw {
  id: string;
  name: string;
  slug: string;
  permissions: Partial<AdminPermissions>;
}

interface AdminPermissions {
  scopes: ("eventStages:seeAll" | "stunts:seeAll" | "patrols:seeAll")[];
}
