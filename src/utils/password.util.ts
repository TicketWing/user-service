import crypto from "node:crypto";

export class PasswordUtil {
  private util = crypto;
  private salt: string;
  private length: number;
  private method: BufferEncoding;

  constructor() {
    this.salt = process.env.SECRET_KEY;
    this.length = 64;
    this.method = "hex";
  }
  hash(password: string) {
    return this.util
      .scryptSync(password, this.salt, this.length)
      .toString(this.method);
  }
  compare(password: string, hash: string) {
    const hashedPassword = this.hash(password);
    return hashedPassword === hash;
  }
}
