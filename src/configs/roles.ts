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

interface IRole {
  name: Roles;
  permissions: Permissions[];
}

export const roles: IRole[] = [
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

export const getPermissionsByRole = (
  userRoles: Roles[]
): Permissions[] | undefined => {
  if (userRoles.includes(Roles.ADMIN)) {
    return roles.find((role) => role.name === Roles.ADMIN)?.permissions;
  } else if (userRoles.includes(Roles.MANAGER)) {
    return roles.find((role) => role.name === Roles.MANAGER)?.permissions;
  } else {
    return roles.find((role) => role.name === Roles.USER)?.permissions;
  }
};
