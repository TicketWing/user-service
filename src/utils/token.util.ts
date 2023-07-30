import jwt from "jsonwebtoken";

export class TokenUtil {
  private jwt: any;

  constructor() {
    this.jwt = jwt;
  }

  generate(id: string, email: string) {
    return this.jwt.sign({ id, email }, process.env.SECRET_KEY);
  }
}
