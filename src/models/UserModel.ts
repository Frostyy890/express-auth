import { Schema, Document, model } from "mongoose";
import { UserData } from "../interfaces";
import { Roles } from "../config/roles";

export interface IUser extends UserData, Document {
  roles: Roles[];
}

const UserSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.refreshToken;
        delete ret.roles;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

export const User = model<IUser>("User", UserSchema);
