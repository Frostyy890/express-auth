import mongoose from "mongoose";

export const connectDB = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString);
    console.log("Successfully connected to the database");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
  }
};
