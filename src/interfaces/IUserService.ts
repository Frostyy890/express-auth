import { Roles } from "../config/roles";
import { IUser } from "../models";

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserData extends UserCredentials {
  refreshToken?: string;
  roles?: Roles[];
}

export type UserUpdateData = Partial<UserData>;

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  getByAttribute(attribute: keyof IUser, value: string): Promise<IUser>;
  create(userData: UserData): Promise<IUser>;
  update(id: string, updateData: UserUpdateData): Promise<IUser>;
  delete(id: string): Promise<void>;
}
