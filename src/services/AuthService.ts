import { IUser } from "../models";
import { FORBIDDEN_ERROR, UNAUTHORIZED_ERROR } from "../errors/common";
import { generateAuthTokens } from "../utils/GenerateAuthTokens";
import { ITokenPayload, IAuthService, IAuthTokens } from "../interfaces";
import { JwtPayload, verify } from "jsonwebtoken";
import { compare } from "bcrypt";
import { REFRESH_TOKEN_SECRET } from "../constants";

export default class AuthService implements IAuthService {
  constructor() {}
  async login(userInDb: IUser, password: string): Promise<IAuthTokens> {
    const isMatch = await compare(password, userInDb.password);
    if (!isMatch)
      throw new UNAUTHORIZED_ERROR({ message: "Inorrect password" });
    const payload: ITokenPayload = {
      userInfo: { email: userInDb.email, roles: userInDb.roles },
    };
    return generateAuthTokens(payload);
  }
  async register(newUser: IUser): Promise<IAuthTokens> {
    const { email, roles } = newUser;
    const payload: ITokenPayload = {
      userInfo: { email, roles },
    };
    return generateAuthTokens(payload);
  }
  async refresh(refreshToken: string, userInDb: IUser): Promise<IAuthTokens> {
    const decoded: JwtPayload = await new Promise((resolve, _) => {
      verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.error(err);
          throw new FORBIDDEN_ERROR({ message: "Failed to verify token" });
        } else resolve(decoded as JwtPayload);
      });
    });
    const { userInfo } = decoded;
    if (userInfo.email !== userInDb.email)
      throw new FORBIDDEN_ERROR({ message: "Invalid token" });
    return generateAuthTokens({ userInfo });
  }
}
