import { CorsOptions } from "cors";
import { ALLOWED_ORIGINS } from "./allowed_origins";
import { FORBIDDEN_ERROR } from "../errors/common";

export const CORS_OPTIONS: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new FORBIDDEN_ERROR({ message: "Not allowed by CORS" }));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
