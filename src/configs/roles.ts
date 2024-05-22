export enum Roles {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
}

export enum Permissions {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

export interface IRole {
  name: Roles;
  permissions: Permissions[];
}

export const ROLES_LIST: IRole[] = [
  {
    name: Roles.ADMIN,
    permissions: [
      Permissions.CREATE,
      Permissions.READ,
      Permissions.UPDATE,
      Permissions.DELETE,
    ],
  },
  {
    name: Roles.MANAGER,
    permissions: [Permissions.CREATE, Permissions.READ, Permissions.UPDATE],
  },
  {
    name: Roles.USER,
    permissions: [Permissions.READ],
  },
];
