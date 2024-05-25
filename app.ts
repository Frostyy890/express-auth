import express from "express";
import { PORT, CONNECTION_STRING } from "./src/constants";
import cors from "cors";
import { CORS_OPTIONS } from "./src/config/cors";
import cookieParser from "cookie-parser";
import "express-async-errors";
import { connectDB } from "./src/config/db";
import { AppRouter } from "./src/routes/AppRoutes";
import { ErrorHandler, Logger } from "./src/middlewares";
import { NOT_FOUND_ERROR } from "./src/errors/common";

const app = express();
app.use(cors(CORS_OPTIONS));
app.options("*", cors(CORS_OPTIONS));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//MIDDLEWARES
//ERROR HANDLER
app.use(Logger);
app.use("/api", AppRouter);
// HANDLE UNKNOWN API REQUESTS
app.use((_req, _res, next) => {
  throw new NOT_FOUND_ERROR();
});
app.use(ErrorHandler);

//INITIALIZE APP
const initializeApp = async () => {
  try {
    await connectDB(CONNECTION_STRING);
    app.listen(PORT || 3002, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

initializeApp();
