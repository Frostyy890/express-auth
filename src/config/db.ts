import mongoose from "mongoose";
import { CONNECTION_STRING } from "./configuration";

export const connectDB = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.log("[db]: successfully connected to the database");
  } catch (err) {
    console.error("[db]: failed to connect to the database:", err);
  }
};
