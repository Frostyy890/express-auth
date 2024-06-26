import { Request, Response, NextFunction } from "express";
import IController from "./common/IController";

export default interface IUserController extends IController {
  getByAttribute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
