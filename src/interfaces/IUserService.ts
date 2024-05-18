import { Roles } from "../configs/roles";
import { IUser } from "../models";

export interface UserData {
  email: string;
  password: string;
  refreshToken?: string;
  roles: Roles[];
}
//Example:
// const newUser: UserData = {
//   email: "",
//   password: "",
//   refreshToken: "",
//   roles: [Roles.USER, Roles.MANAGER, Roles.ADMIN],
// };

export interface IUserService {
  getAll(): Promise<IUser[]>;
  getById(id: string): Promise<IUser>;
  getByAttribute(attribute: keyof IUser, value: string): Promise<IUser>;
  create(userData: UserData): Promise<IUser>;
  update(id: string, userData: Partial<UserData>): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}
