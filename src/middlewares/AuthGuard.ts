import { Request, Response, NextFunction } from "express";
import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from "../errors/common";
import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "dotenv";

interface AuthRequest extends Request {
  user?: string;
}

config();
export const AuthGuard = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UNAUTHORIZED_ERROR();
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw new UNAUTHORIZED_ERROR();
  }
  verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
      throw new FORBIDDEN_ERROR();
    }
    req.user = (decoded as JwtPayload).email;
    next();
  });
};
