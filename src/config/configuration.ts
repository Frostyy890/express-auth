import dotenv from "dotenv";

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV ?? "dev"; // "test" | "dev" | "prod"
export const PORT = process.env.PORT ?? 3002;
export const CONNECTION_STRING = process.env.CONNECTION_STRING ?? "";
export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? "access-token-secret";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? "refresh-token-secret";
