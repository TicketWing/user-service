/* eslint-disable indent */
import { NextFunction, Response } from "express";
import { ResponseConstructor } from "../constructors/response.constructor";

export const responseMiddleware =
  (cb: any) =>
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await cb(req);
      const result = new ResponseConstructor<any>(
        true,
        "Success",
        data
      ).toJson();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
