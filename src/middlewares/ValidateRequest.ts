import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import REQUEST_VALIDATION_ERROR from "../errors/express-validator";

export const ValidateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new REQUEST_VALIDATION_ERROR({
      validationErrors: errors.array(),
      logging: true,
    });
  }
  next();
};
