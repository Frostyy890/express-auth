import { IUser } from "../models";
import { IAuthTokens } from "./IAuthService";
import { UserCredentials } from "./IUserService";
export default interface IAuthFacade {
  login(userCredentials: UserCredentials): Promise<IAuthTokens>;
  register(userCredentials: UserCredentials): Promise<IAuthTokens>;
  refresh(refreshToken: string): Promise<{ accessToken: string }>;
  logout(refreshToken: string): Promise<IUser | null>;
}
