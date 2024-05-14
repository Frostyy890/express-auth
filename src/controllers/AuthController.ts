import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interfaces";
import { AuthService, UserService } from "../services";

export default class AuthController implements IAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userInDb = await this.userService.getByEmail(req.body.email);
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
}
