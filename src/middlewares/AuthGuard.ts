import { Response, NextFunction } from "express";
import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from "../errors/common";
import { JwtPayload, verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/configuration";
import { IAuthGuard, IAuthRequest } from "../interfaces";
import { Roles, Permissions } from "../config/roles";
import { Role } from "../models";

export default class AuthGuard implements IAuthGuard {
  constructor() {}
  verifyToken(req: IAuthRequest, res: Response, next: NextFunction): void {
    const { authorization } = req.headers;
    if (!authorization) throw new UNAUTHORIZED_ERROR();
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") throw new UNAUTHORIZED_ERROR();
    verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err)
        throw new FORBIDDEN_ERROR({
          message: "Failed to verify token",
        });
      req.user = (decoded as JwtPayload).userInfo;
      next();
    });
  }
  verifyRoles(allowedRoles: Roles[]) {
    return (req: IAuthRequest, res: Response, next: NextFunction): void => {
      if (!req?.user || !req.user?.roles) throw new FORBIDDEN_ERROR();
      const hasRole = req.user.roles.some((role) =>
        allowedRoles.includes(role)
      );
      if (!hasRole)
        throw new FORBIDDEN_ERROR({
          message: "You're not authorized to access this resource",
        });
      next();
    };
  }
  verifyPermissions(permission: Permissions) {
    return (req: IAuthRequest, res: Response, next: NextFunction): void => {
      if (!req?.user || !req.user?.roles) throw new FORBIDDEN_ERROR();
      const userPermissions = new Role().getPermissionsByRole(req.user.roles);
      if (!userPermissions || !userPermissions.includes(permission))
        throw new FORBIDDEN_ERROR({
          message: `You're not authorized to ${permission}`,
        });
      next();
    };
  }
}
