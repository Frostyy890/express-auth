import { Roles } from "../configs/roles";
import { IUser } from "../models";

export interface UserData {
  email: string;
  password: string;
  refreshToken?: string;
  roles?: Roles[];
}

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  getByAttribute(attribute: keyof IUser, value: string): Promise<IUser>;
  create(userData: UserData): Promise<IUser>;
  update(id: string, userData: Partial<UserData>): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}
