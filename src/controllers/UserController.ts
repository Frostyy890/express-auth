import { Request, Response, NextFunction } from "express";
import { IUser } from "../models";
import { IUserController } from "../interfaces";
import { UserService } from "../services";

export default class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const users = await this.userService.getAll();
    res.status(200).json({ data: users });
  }
  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const user = await this.userService.getById(id);
    res.status(200).json({ data: user });
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
    res.status(200).json({ data: user });
  }
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const newUser = await this.userService.create(req.body);
    res.status(201).json({ data: newUser, message: "Successfully created" });
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const updatedUser = await this.userService.update(id, req.body);
    res
      .status(200)
      .json({ data: updatedUser, message: "Successfully updated" });
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    await this.userService.delete(id);
    res.status(200).json({ message: "Successfully deleted" });
  }
}
