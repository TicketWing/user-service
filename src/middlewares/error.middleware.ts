import { Response } from "express";
import { CustomError } from "../utils/error.util";

export const errorMiddleware = (
  err: Error | CustomError,
  _req: any,
  res: Response
) => {
  res.status(500).send(err.message);
};
