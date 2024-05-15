import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interfaces";
import { AuthService, UserService } from "../services";
import { UNAUTHORIZED_ERROR } from "../errors/common";

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
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
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
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
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
    console.log(cookies.jwt);
    const refreshToken: string = cookies.jwt;
    const userInDb = await this.userService.getByAttribute(
      "refreshToken",
      refreshToken
    );
    const { accessToken } = await this.authService.refresh(
      refreshToken,
      userInDb
    );
    res.status(200).json({ accessToken });
  }
}
