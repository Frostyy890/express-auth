import { IUser } from "../models";

export default interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  getByEmail(email: string): Promise<IUser>;
  create(userData: {
    email: string;
    password: string;
    refreshToken?: string;
  }): Promise<IUser>;
  update(
    id: string,
    userData: {
      email: string;
      password: string;
      refreshToken?: string;
    }
  ): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}
