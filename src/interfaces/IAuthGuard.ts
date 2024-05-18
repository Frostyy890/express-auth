import { Request, Response, NextFunction } from "express";
import { Roles, Permissions } from "../configs/roles";

type userInfo = { email: string; roles: Roles[] };

export interface IAuthRequest extends Request {
  user?: userInfo;
}

export interface ITokenPayload {
  userInfo: userInfo;
}

export interface IAuthGuard {
  verifyToken(req: IAuthRequest, res: Response, next: NextFunction): void;
  verifyRoles(
    allowedRoles: Roles[]
  ): (req: IAuthRequest, res: Response, next: NextFunction) => void;
  verifyPermissions(
    permission: Permissions
  ): (req: IAuthRequest, res: Response, next: NextFunction) => void;
}
