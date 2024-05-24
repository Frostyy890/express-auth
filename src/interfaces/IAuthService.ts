import { IUser } from "../models";

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}


export interface IAuthService {
  login(userInDb: IUser, password: string): Promise<IAuthTokens>;
  register(newUser: IUser): Promise<IAuthTokens>;
  refresh(refreshToken: string, userInDb: IUser): Promise<IAuthTokens>;
}
