import { Request, Response, NextFunction, CookieOptions } from "express";
import { IAuthController } from "../interfaces";
import { AuthService, UserService } from "../services";
import { UNAUTHORIZED_ERROR } from "../errors/common";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: true,
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
    res.cookie("jwt", refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ accessToken, message: "Successfully logged in" });
  }
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.register(
      req.body.email
    );
    await this.userService.create({
      ...req.body,
      refreshToken,
    });
    res.cookie("jwt", refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ accessToken, message: "Successfully signed up" });
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      throw new UNAUTHORIZED_ERROR();
    }
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
      res.clearCookie("jwt", COOKIE_OPTIONS);
      res.sendStatus(204);
      return;
    }
    // DELETE REFRESH TOKEN FROM DB
    await this.userService.update(userInDb._id.toString(), {
      refreshToken: "",
    });
    res.clearCookie("jwt", COOKIE_OPTIONS);
    res.sendStatus(204);
  }
}
