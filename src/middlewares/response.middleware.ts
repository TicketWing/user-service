/* eslint-disable indent */
import { NextFunction, Response } from "express";
import { ResponseConstructor } from "../constructors/response.constructor";

export const responseMiddleware =
  (cb: any) =>
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await cb(req);

      if (data.refreshToken) {
        res.cookie("refreshToken", data.refreshToken);
        delete data.refreshToken;
      }

      const result = new ResponseConstructor<any>(true, "Success", data);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
