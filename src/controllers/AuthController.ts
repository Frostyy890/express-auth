import { Request, Response, NextFunction, CookieOptions } from "express";
import { IAuthController } from "../interfaces";
import { AuthService, UserService } from "../services";
import { UNAUTHORIZED_ERROR } from "../errors/common";

const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  // secure: true, // TODO: Enable in production
};

export default class AuthController implements IAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userInDb = await this.userService.getByAttribute(
      "email",
      req.body.email
    );
    const userId: string = userInDb?._id.toString();
    const { accessToken, refreshToken } = await this.authService.login(
      userInDb,
      req.body.password
    );
    await this.userService.update(userId, {
      refreshToken,
    });
    res
      .status(200)
      .cookie("jwt", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({
        data: {
          user: userInDb,
          accessToken,
          message: "Successfully logged in",
        },
      });
  }
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;
    const newUser = await this.userService.create({ email, password });
    const { accessToken, refreshToken } = await this.authService.register(
      newUser
    );
    await this.userService.update(newUser._id.toString(), {
      refreshToken,
    });
    res
      .status(200)
      .cookie("jwt", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({
        data: { user: newUser, accessToken, message: "Successfully signed up" },
      });
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const cookies = req.cookies;
    if (!cookies?.jwt) throw new UNAUTHORIZED_ERROR();
    const refreshToken: string = cookies.jwt;
    const userInDb = await this.userService.getByAttribute(
      "refreshToken",
      refreshToken
    );
    // GET NEW ACCESS TOKEN FROM REFRESH TOKEN
    const { accessToken } = await this.authService.refresh(
      refreshToken,
      userInDb
    );
    res.status(200).json({ accessToken });
  }
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      res.sendStatus(204);
      return;
    }
    const refreshToken = cookies.jwt;
    const userInDb = await this.userService.getByAttribute(
      "refreshToken",
      refreshToken
    );
    if (!userInDb) {
      res.clearCookie("jwt", REFRESH_TOKEN_COOKIE_OPTIONS).sendStatus(204);
      return;
    }
    // DELETE REFRESH TOKEN FROM DB
    await this.userService.update(userInDb._id.toString(), {
      refreshToken: "",
    });
    res.clearCookie("jwt", REFRESH_TOKEN_COOKIE_OPTIONS).sendStatus(204);
  }
}
