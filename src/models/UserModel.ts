import { Schema, Document, model } from "mongoose";
import { UserData } from "../interfaces";
import { Roles } from "../configs/roles";

export interface IUser extends UserData, Document {}

const UserSchema = new Schema<IUser>({
  email: {
    type: Schema.Types.String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: Schema.Types.String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  roles: [
    {
      type: Schema.Types.String,
      required: true,
      enum: Roles,
      default: Roles.USER,
    },
  ],
  refreshToken: Schema.Types.String,
});

export const User = model<IUser>("User", UserSchema);
