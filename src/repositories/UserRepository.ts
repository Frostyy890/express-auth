import { Model } from "mongoose";
import { IUser } from "../models";
import { IUserRepository, UserData, UserUpdateData } from "../interfaces";

export default class UserRepository implements IUserRepository {
  constructor(private readonly user: Model<IUser>) {}

  async getAll(): Promise<IUser[]> {
    return this.user.find({}).exec();
  }

  async getById(id: string): Promise<IUser | null> {
    return this.user.findById(id).exec();
  }
  async getByAttribute(
    attribute: keyof IUser,
    value: string
  ): Promise<IUser | null> {
    return this.user.findOne({ [attribute]: value }).exec();
  }
  async create(userData: UserData): Promise<IUser> {
    return await this.user.create(userData);
  }
  async update(id: string, updateData: UserUpdateData): Promise<IUser | null> {
    return await this.user
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
  async delete(id: string): Promise<void> {
    await this.user.deleteOne({ _id: id }).exec();
  }

  async isEmailUnique(email: string, id?: string): Promise<boolean> {
    const user = await this.user.findOne({ email, _id: { $ne: id } }).exec();
    return !user;
  }
}
