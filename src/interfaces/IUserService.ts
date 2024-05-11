import { IUser } from "../models";

export default interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  getByEmail(email: string): Promise<IUser>;
  create(userData: IUser): Promise<IUser | null>;
  update(id: string, userData: IUser): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}
