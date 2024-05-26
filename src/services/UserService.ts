import { Model } from "mongoose";
import { IUser } from "../models";
import {
  BAD_REQUEST_ERROR,
  CONFLICT_ERROR,
  NOT_FOUND_ERROR,
} from "../errors/common";
import { IUserService, UserData, UserUpdateData } from "../interfaces";
import { hash, compare } from "bcrypt";
import { Roles } from "../config/roles";
import { UserRepository } from "../repositories";

const SALT_ROUNDS = 10;

export default class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(): Promise<IUser[]> {
    return this.userRepository.getAll();
  }
  async getById(id: string): Promise<IUser> {
    const user = await this.userRepository.getById(id);
    if (!user) throw new NOT_FOUND_ERROR({ message: "User not found" });
    return user;
  }
  async getByAttribute(attribute: keyof IUser, value: string): Promise<IUser> {
    const user = await this.userRepository.getByAttribute(attribute, value);
    if (!user)
      throw new NOT_FOUND_ERROR({
        message: `User with ${attribute} ${value} doesn't exist`,
      });
    return user;
  }
  async create(userData: UserData): Promise<IUser> {
    const { email, password, roles } = userData;
    await this.ensureEmailIsUnique(email);
    const hashedPassword = await hash(password, SALT_ROUNDS);
    const userRoles = roles ?? [Roles.USER];
    const newUser = { email, roles: userRoles, password: hashedPassword };
    return await this.userRepository.create(newUser);
  }
  async update(id: string, updateData: UserUpdateData): Promise<IUser> {
    const { email, password } = updateData;
    if (email) await this.ensureEmailIsUnique(email, id);
    if (password) updateData.password = await hash(password, SALT_ROUNDS);
    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) throw new NOT_FOUND_ERROR({ message: "User not found" });
    return updatedUser;
  }
  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.userRepository.delete(id);
  }
  private async ensureEmailIsUnique(email: string, id?: string): Promise<void> {
    const isUnique = await this.userRepository.isEmailUnique(email, id);
    if (!isUnique)
      throw new CONFLICT_ERROR({
        message: `User with email ${email} already exists`,
      });
  }
}
