import mongoose from "mongoose";

export const connectDB = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString);
    console.log("[db]: successfully connected to the database");
  } catch (err) {
    console.error("[db]: failed to connect to the database:", err);
  }
};
