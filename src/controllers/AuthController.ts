import { Request, Response, NextFunction, CookieOptions } from "express";
import { IAuthController } from "../interfaces";
import { AuthFacade } from "../facades";
import { HttpStatus } from "../errors/common";

const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  // secure: true, // TODO: Enable in production
};

export default class AuthController implements IAuthController {
  constructor(private readonly authFacade: AuthFacade) {}
  async login(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { tokens, user } = await this.authFacade.login(req.body);
    const { accessToken, refreshToken } = tokens;
    res
      .status(HttpStatus.OK)
      .cookie("jwt", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({ accessToken, user });
  }
  async register(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const { tokens, user } = await this.authFacade.register(req.body);
    const { accessToken, refreshToken } = tokens;
    res
      .status(HttpStatus.CREATED)
      .cookie("jwt", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({ accessToken, user });
  }
  async refresh(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const { accessToken } = await this.authFacade.refresh(req.cookies.jwt);
    res.status(HttpStatus.OK).json({ accessToken });
  }
  async logout(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const { cookies } = req;
    if (!cookies?.jwt) {
      res.sendStatus(HttpStatus.NO_CONTENT);
      return;
    }
    const updatedUser = await this.authFacade.logout(cookies.jwt);
    if (!updatedUser) {
      res
        .clearCookie("jwt", REFRESH_TOKEN_COOKIE_OPTIONS)
        .sendStatus(HttpStatus.NO_CONTENT);
      return;
    }
    res
      .clearCookie("jwt", REFRESH_TOKEN_COOKIE_OPTIONS)
      .sendStatus(HttpStatus.NO_CONTENT);
  }
}
