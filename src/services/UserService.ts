import { Model } from "mongoose";
import { IUser } from "../models";
import {
  BAD_REQUEST_ERROR,
  CONFLICT_ERROR,
  NOT_FOUND_ERROR,
} from "../errors/common";
import { IUserService, UserData } from "../interfaces";
import { hash, compare } from "bcrypt";
import { Roles, roles } from "../configs/roles";

export default class UserService implements IUserService {
  constructor(private readonly user: Model<IUser>) {}

  async getAll(): Promise<IUser[]> {
    return this.user.find({}).lean().exec();
  }
  async getById(id: string): Promise<IUser> {
    const user = await this.user.findById(id).exec();
    if (!user) throw new NOT_FOUND_ERROR({ message: "User not found" });
    return user;
  }
  async getByAttribute(attribute: keyof IUser, value: string): Promise<IUser> {
    const allowedUserAttributes: (keyof IUser)[] = [
      "_id",
      "email",
      "password",
      "refreshToken",
    ];
    if (!allowedUserAttributes.includes(attribute))
      throw new BAD_REQUEST_ERROR({
        message: `Invalid attribute: ${attribute}`,
      });
    const user = await this.user.findOne({ [attribute]: value }).exec();
    if (!user)
      throw new NOT_FOUND_ERROR({
        message: `User with ${attribute} ${value} doesn't exist`,
      });
    return user;
  }
  async create(userData: UserData): Promise<IUser> {
    const { email, password, roles } = userData;
    const defaultRole = Roles.USER;
    const userInDb = await this.user.findOne({ email }).exec();
    if (userInDb)
      throw new CONFLICT_ERROR({
        message: `User with email ${email} already exists`,
      });
    const hashedPassword = await hash(password, 10);
    const userRoles = roles ? roles : [defaultRole];
    const newUser = { email, roles: userRoles, password: hashedPassword };
    return await this.user.create(newUser);
  }
  async update(id: string, userData: Partial<UserData>): Promise<IUser | null> {
    const { email, password } = userData;
    const user = await this.getById(id);
    if (email) {
      const userWithSameEmail = await this.user.findOne({ email }).exec();
      if (userWithSameEmail && userWithSameEmail._id.toString() !== id)
        throw new CONFLICT_ERROR({
          message: `User with email ${email} already exists`,
        });
    }
    if (password) {
      const isMatch = await compare(password, user.password);
      if (isMatch)
        throw new BAD_REQUEST_ERROR({
          message: "New password can't be the same as old one",
        });
      const newHashedPassword = await hash(password, 10);
      userData.password = newHashedPassword;
    }
    const updatedUser = await this.user
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();
    return updatedUser;
  }
  async delete(id: string): Promise<void> {
    const user = await this.user.findByIdAndDelete(id).exec();
    if (!user) throw new NOT_FOUND_ERROR({ message: "User not found" });
  }
}
