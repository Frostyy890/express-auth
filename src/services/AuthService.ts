import { compare } from "bcrypt";
import { IUser } from "../models";
import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from "../errors/common";
import { genAccessRefreshToken } from "../utils/GenAccessRefreshToken";
import { IAuthService } from "../interfaces";
import { JwtPayload, verify } from "jsonwebtoken";

export default class AuthService implements IAuthService {
  constructor() {}
  async login(
    userInDb: IUser,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const isMatch = await compare(password, userInDb.password);
    if (!isMatch)
      throw new UNAUTHORIZED_ERROR({ message: "Inorrect password" });
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
  async refresh(
    refreshToken: string,
    userInDb: IUser
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded: JwtPayload = await new Promise((resolve, reject) => {
      verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded as JwtPayload);
        }
      );
    });
    if (decoded.email !== userInDb.email)
      throw new FORBIDDEN_ERROR({ message: "Invalid token" });
    return genAccessRefreshToken({ email: decoded.email });
  }
}
