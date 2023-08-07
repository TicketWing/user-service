import jwt from "jsonwebtoken";
import { AuthTokens, Identification } from "../types/user.types";
import { TokenOptions } from "../types/token.types";

export class TokenUtil {
  private util = jwt;
  private accessOptions: TokenOptions;
  private refreshOptions: TokenOptions;

  constructor() {
    this.accessOptions = {
      secret: "secret",
      expiresIn: "3600000",
    };
    this.refreshOptions = {
      secret: "secret",
      expiresIn: "3600000",
    };
  }

  private generate(value: Identification, secret: string, expiresIn: string) {
    return this.util.sign(value, secret, { expiresIn });
  }

  decodeToken(token: string) {
    const isAccessToken = token.includes("Bearer ");
    const { secret } = isAccessToken ? this.accessOptions : this.refreshOptions;

    if (isAccessToken) {
      token = token.replace("Bearer ", "");
    }

    return jwt.verify(token, secret);
  }

  getAccessToken(value: Identification): string {
    const { secret, expiresIn } = this.accessOptions;
    const token = this.generate(value, secret, expiresIn);
    return `Bearer ${token}`;
  }

  getRefreshToken(value: Identification): string {
    const { secret, expiresIn } = this.refreshOptions;
    const token = this.generate(value, secret, expiresIn);
    return token;
  }

  getTokens(value: Identification): AuthTokens {
    const accessToken = this.getAccessToken(value);
    const refreshToken = this.getRefreshToken(value);
    return { accessToken, refreshToken };
  }
}
