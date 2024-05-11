import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

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
});

export const User = model<IUser>("User", UserSchema);
