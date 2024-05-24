import { Request, Response, NextFunction, CookieOptions } from "express";
import { IAuthController } from "../interfaces";
import { AuthFacade } from "../facades";

const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none",
  // secure: true, // TODO: Enable in production
};

export default class AuthController implements IAuthController {
  constructor(private readonly authFacade: AuthFacade) {}
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { accessToken, refreshToken } = await this.authFacade.login(req.body);
    res
      .status(200)
      .cookie("jwt", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({
        data: {
          accessToken,
          message: "Successfully signed in",
        },
      });
  }
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authFacade.register(
      req.body
    );
    res
      .status(200)
      .cookie("jwt", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
      .json({
        data: { accessToken, message: "Successfully signed up" },
      });
  }
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { accessToken } = await this.authFacade.refresh(req.cookies.jwt);
    res.status(200).json({ data: { accessToken } });
  }
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { cookies } = req;
    if (!cookies?.jwt) {
      res.sendStatus(204);
      return;
    }
    const updatedUser = await this.authFacade.logout(cookies.jwt);
    if (!updatedUser) {
      res.clearCookie("jwt", REFRESH_TOKEN_COOKIE_OPTIONS).sendStatus(204);
      return;
    }
    res.clearCookie("jwt", REFRESH_TOKEN_COOKIE_OPTIONS).sendStatus(204);
  }
}
