import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/CustomError";
import { writeToFile } from "../utils/WriteToFile";
export const ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handled errors
  if (err instanceof CustomError) {
    const { statusCode, errors, logging, stack } = err;
    if (logging) {
      const formatedError = JSON.stringify(
        {
          statusCode,
          errors,
          stack,
        },
        null,
        2
      );
      writeToFile("error", formatedError);
    }

    return res.status(statusCode).send({ errors });
  }

  // Unhandled errors
  console.error(JSON.stringify(`Unhandled error: ${err}`, null, 2));
  return res
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};
