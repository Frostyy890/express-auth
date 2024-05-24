import { Request, Response, NextFunction } from "express";
import { IUser } from "../models";
import { IUserController } from "../interfaces";
import { UserService } from "../services";

export default class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const users = await this.userService.getAll();
    res.status(200).json({ users });
  }
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user = await this.userService.getById(req.params.id);
    res.status(200).json({ user });
  }
  async getByAttribute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { attribute, value } = req.params;
    const user = await this.userService.getByAttribute(
      attribute as keyof IUser,
      value
    );
    res.status(200).json({ user });
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const newUser = await this.userService.create(req.body);
    res.status(201).json({ newUser });
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const updatedUser = await this.userService.update(req.params.id, req.body);
    res.status(200).json({ updatedUser });
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.userService.delete(req.params.id);
    res.status(200).json({ message: "successfully deleted" });
  }
}
