import { Response, NextFunction } from "express";
import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from "../errors/common";
import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "dotenv";
import { IAuthGuard, IAuthRequest } from "../interfaces";
import { Roles, Permissions, getPermissionsByRole } from "../configs/roles";

config();

export default class AuthGuard implements IAuthGuard {
  constructor() {}
  public verifyToken(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): void {
    const { authorization } = req.headers;
    if (!authorization) throw new UNAUTHORIZED_ERROR();
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") throw new UNAUTHORIZED_ERROR();
    verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
      if (err) throw new FORBIDDEN_ERROR({ message: "Failed to verify token" });
      req.user = (decoded as JwtPayload).userInfo;
      next();
    });
  }
  public verifyRoles(
    allowedRoles: Roles[]
  ): (req: IAuthRequest, res: Response, next: NextFunction) => void {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
      if (!req?.user && !req.user?.roles)
        throw new FORBIDDEN_ERROR({
          message: "You're not authorized to access this resource",
        });
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
  public verifyPermissions(permission: Permissions) {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
      if (!req?.user && !req.user?.roles)
        throw new FORBIDDEN_ERROR({
          message: "You're not authorized to access this resource",
        });
      const userPermissions = getPermissionsByRole(req.user.roles);
      if (!userPermissions)
        throw new FORBIDDEN_ERROR({
          message: "You're not authorized to access this resource",
        });
      if (!userPermissions.includes(permission))
        throw new FORBIDDEN_ERROR({
          message: `You're not authorized to ${permission}`,
        });
      next();
    };
  }
}
