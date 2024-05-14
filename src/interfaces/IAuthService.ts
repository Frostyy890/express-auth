import { IUser } from "../models";

export default interface IAuthService {
  login(
    userInDb: IUser,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
  register(email: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}
