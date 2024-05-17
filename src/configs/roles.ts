export enum Roles {
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
  ANONYMOUS = "anonymous",
}

interface IRole {
  name: Roles;
  permissions: string[];
}

export const roles: IRole[] = [
  {
    name: Roles.ADMIN,
    permissions: ["create", "read", "update", "delete"],
  },
  {
    name: Roles.MANAGER,
    permissions: ["create", "read", "update"],
  },
  {
    name: Roles.USER,
    permissions: ["read"],
  },
];
