export class CustomError extends Error {
  public name: string;
  public message: string;
  public code: number;

  constructor(name: string, msg: string, code: number) {
    super(msg);
    this.name = name;
    this.message = msg;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
