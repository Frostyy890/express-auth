import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import { connectDB } from "./src/configs/db";
import { AppRouter } from "./src/routes/AppRoutes";
import { ErrorHandler, ReqLogger } from "./src/middlewares";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PORT, CONNECTION_STRING } = process.env;
//MIDDLEWARES
//ERROR HANDLER
app.use(ErrorHandler);
app.use(ReqLogger);
app.use("/api", AppRouter);
const initializeApp = async () => {
  try {
    await connectDB(CONNECTION_STRING as string);
    app.listen(PORT || 3002, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

initializeApp();
