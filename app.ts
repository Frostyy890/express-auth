import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import "express-async-errors";
import { connectDB } from "./src/configs/db";
import { AppRouter } from "./src/routes/AppRoutes";
import { ErrorHandler, ReqLogger } from "./src/middlewares";

config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const { PORT, CONNECTION_STRING } = process.env;
//MIDDLEWARES
//ERROR HANDLER
app.use(ReqLogger);
app.use("/api", AppRouter);
app.use(ErrorHandler);
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
