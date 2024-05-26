import { IUser } from "../models";
import { UserData, UserUpdateData } from "./IUserService";

export default interface IUserRepository {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser | null>;
  getByAttribute(attribute: keyof IUser, value: string): Promise<IUser | null>;
  create(userData: UserData): Promise<IUser>;
  update(id: string, updateData: UserUpdateData): Promise<IUser | null>;
  delete(id: string): Promise<void>;
  isEmailUnique(email: string, id?: string): Promise<boolean>;
}
