import { sign } from "jsonwebtoken";
import { config } from "dotenv";
config();

export const genAccessRefreshToken = (payload: {
  [key: string]: string;
}): { accessToken: string; refreshToken: string } => {
  const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "60s",
  });
  const refreshToken = sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
  return { accessToken, refreshToken };
};
