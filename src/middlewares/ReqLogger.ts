import { Request, Response, NextFunction } from "express";

export const ReqLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};
