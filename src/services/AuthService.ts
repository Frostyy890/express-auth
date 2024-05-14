import { compare } from "bcrypt";
import { IUser } from "../models";
import { UNAUTHORIZED_ERROR } from "../errors/common";
import { genAccessRefreshToken } from "../utils/GenAccessRefreshToken";

export default class AuthService {
  constructor() {}
  async login(
    userInDb: IUser,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const isMatch = await compare(password, userInDb.password);
    if (!isMatch) throw new UNAUTHORIZED_ERROR({ message: "Wrong password" });
    const { accessToken, refreshToken } = genAccessRefreshToken({
      email: userInDb.email,
    });
    return { accessToken, refreshToken };
  }
  async register(
    email: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return genAccessRefreshToken({ email });
  }
}
