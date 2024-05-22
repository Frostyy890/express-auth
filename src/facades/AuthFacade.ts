import { UserData, IAuthFacade } from "../interfaces";
import { IUser } from "../models";
import { AuthService, UserService } from "../services";

export default class AuthFacade implements IAuthFacade {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
  public async login(
    userData: UserData
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = userData;
    const userInDb = await this.userService.getByAttribute("email", email);
    const { accessToken, refreshToken } = await this.authService.login(
      userInDb,
      password
    );
    await this.userService.update(userInDb._id.toString(), {
      refreshToken,
    });
    return { accessToken, refreshToken };
  }
  public async register(
    userData: UserData
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = userData;
    const newUser = await this.userService.create({ email, password });
    const { accessToken, refreshToken } = await this.authService.register(
      newUser
    );
    await this.userService.update(newUser._id.toString(), {
      refreshToken,
    });
    return { accessToken, refreshToken };
  }
  public async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const userInDb = await this.userService.getByAttribute(
      "refreshToken",
      refreshToken
    );
    const { accessToken } = await this.authService.refresh(
      refreshToken,
      userInDb
    );
    return { accessToken };
  }
  public async logout(refreshToken: string): Promise<IUser | null> {
    const userInDb = await this.userService.getByAttribute(
      "refreshToken",
      refreshToken
    );
    return await this.userService.update(userInDb._id.toString(), {
      refreshToken: "",
    });
  }
}
