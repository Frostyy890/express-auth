import { sign } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants";
import { IAuthTokens } from "../interfaces";

export const generateAuthTokens = (payload: object): IAuthTokens => {
  const accessToken = sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "60s",
  });
  const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
};
