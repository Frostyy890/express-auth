import { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../config/configuration";
import { writeToFile } from "../utils/WriteToFile";

export const Logger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `[${new Date().toISOString()}]: ${req.method} ${
      req.originalUrl
    } ${res.statusCode} ${duration}ms - ${req.ip} - ${
      req.headers["user-agent"]
    }`;
    console.log(message);
    if (NODE_ENV === "test") writeToFile("request", message);
  });
  next();
};
