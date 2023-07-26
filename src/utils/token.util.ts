import jwt from "jsonwebtoken";

export class TokenUtil {
  private jwt: any;

  constructor() {
    this.jwt = jwt;
  }

  generate(email: string) {
    return this.jwt.sign({ email }, process.env.SECRET_KEY);
  }
}
