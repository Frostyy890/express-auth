import { Request, Response, NextFunction } from "express";
import { IUser } from "../models";
import { IUserController } from "../interfaces";
import { UserService } from "../services";
import { HttpStatus } from "../errors/common";

export default class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}
  async getAll(
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const users = await this.userService.getAll();
    res.status(HttpStatus.OK).json({ users });
  }
  async getById(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const user = await this.userService.getById(req.params.id);
    res.status(HttpStatus.OK).json({ user });
  }
  async getByAttribute(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const { attribute, value } = req.params;
    const user = await this.userService.getByAttribute(
      attribute as keyof IUser,
      value
    );
    res.status(HttpStatus.OK).json({ user });
  }
  async create(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const newUser = await this.userService.create(req.body);
    res.status(HttpStatus.CREATED).json({ newUser });
  }

  async update(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const updatedUser = await this.userService.update(req.params.id, req.body);
    res.status(HttpStatus.OK).json({ updatedUser });
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.userService.delete(req.params.id);
    res.status(HttpStatus.OK).json({ message: "successfully deleted" });
  }
}
