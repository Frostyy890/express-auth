import { IUser } from "../models";
import { UserData } from "./IUserService";
export default interface IAuthFacade {
  login(
    userData: UserData
  ): Promise<{ accessToken: string; refreshToken: string }>;
  register(
    userData: UserData
  ): Promise<{ accessToken: string; refreshToken: string }>;
  refresh(refreshToken: string): Promise<{ accessToken: string }>;
  logout(refreshToken: string): Promise<IUser | null>;
}
