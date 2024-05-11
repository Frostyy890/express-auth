import { Model } from "mongoose";
import { IUser } from "../models";
import { CONFLICT_ERROR, NOT_FOUND_ERROR } from "../errors/common";
import { IUserService } from "../interfaces";
import { hash } from "bcrypt";

export default class UserService implements IUserService {
  constructor(private readonly user: Model<IUser>) {}

  async getAll(): Promise<IUser[]> {
    const users = await this.user.find({}).exec();
    return users;
  }
  async getById(id: string): Promise<IUser> {
    const user = await this.user.findById(id).exec();
    if (!user) throw new NOT_FOUND_ERROR({ message: "User not found" });
    return user;
  }
  async getByEmail(email: string): Promise<IUser> {
    const user = await this.user.findOne({ email }).exec();
    if (!user)
      throw new NOT_FOUND_ERROR({
        message: `User with email ${email} doesn't exist`,
      });
    return user;
  }
  async create(userData: IUser): Promise<IUser | null> {
    const { email, password } = userData;
    const userInDb = await this.user.findOne({ email }).exec();
    if (userInDb) {
      throw new CONFLICT_ERROR({
        message: `User with email ${email} already exists`,
      });
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await this.user.create({
      ...userData,
      password: hashedPassword,
    });
    return newUser;
  }
  async update(id: string, userData: IUser): Promise<IUser | null> {
    const { email, password } = userData;
    const userWithEmail = await this.user.findOne({ email }).exec();
    if (userWithEmail && userWithEmail._id.toString() !== id) {
      throw new CONFLICT_ERROR({
        message: `User with email ${email} already exists`,
      });
    }
    const newHashedPassword = await hash(password, 10);
    const updatedUser = await this.user
      .findByIdAndUpdate(
        id,
        { ...userData, password: newHashedPassword },
        { new: true }
      )
      .exec();
    return updatedUser;
  }
  async delete(id: string): Promise<void> {
    const user = await this.user.findByIdAndDelete(id).exec();
    if (!user) throw new NOT_FOUND_ERROR({ message: "User not found" });
  }
}
