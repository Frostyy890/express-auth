import { config } from "dotenv";

config();

//SERVER CONSTANTS
export const { NODE_ENV, PORT } = process.env as {
  NODE_ENV: string;
  PORT: string;
};

//JWT CONSTANTS
export const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env as {
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
};

//DB CONSTANTS
export const { CONNECTION_STRING } = process.env as {
  CONNECTION_STRING: string;
};
