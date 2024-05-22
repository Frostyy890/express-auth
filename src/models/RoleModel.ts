import { IRole, Roles, ROLES_LIST } from "../configs/roles";

export default class Role {
  private readonly roles: IRole[];
  constructor() {
    this.roles = ROLES_LIST;
  }

  getRoles() {
    return this.roles;
  }
  getPermissionsByRole(userRoles: Roles[]) {
    if (userRoles.includes(Roles.ADMIN))
      return this.roles.find((role) => role.name === Roles.ADMIN)?.permissions;
    else if (userRoles.includes(Roles.MANAGER))
      return this.roles.find((role) => role.name === Roles.MANAGER)
        ?.permissions;
    else
      return this.roles.find((role) => role.name === Roles.USER)?.permissions;
  }
}
