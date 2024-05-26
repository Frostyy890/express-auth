import { IUser } from "../models";
import { IAuthTokens } from "./IAuthService";
import { UserCredentials } from "./IUserService";

export default interface IAuthFacade {
  login(
    userCredentials: UserCredentials
  ): Promise<{ tokens: IAuthTokens; user: IUser }>;
  register(
    userCredentials: UserCredentials
  ): Promise<{ tokens: IAuthTokens; user: IUser }>;
  refresh(refreshToken: string): Promise<{ accessToken: string }>;
  logout(refreshToken: string): Promise<IUser | null>;
}
