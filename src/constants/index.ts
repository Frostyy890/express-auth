import { config } from "dotenv";

config();

export const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env as {
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
};

export const { PORT, CONNECTION_STRING } = process.env as {
  PORT: string;
  CONNECTION_STRING: string;
};
