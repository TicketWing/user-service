import { Response } from "express";
import { CustomError } from "../utils/error.util";
import { ResponseConstructor } from "../constructors/response.constructor";

export const errorMiddleware = (
  err: Error | CustomError,
  _req: any,
  res: Response
) => {
  const result = new ResponseConstructor(false, err.message);
  res.status(500).json(result);
};
