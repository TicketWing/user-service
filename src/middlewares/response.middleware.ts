/* eslint-disable indent */
import { NextFunction, Response } from "express";

export const responseMiddleware =
  (cb: any) =>
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await cb(req);
      if (result.redirect) {
        res.json(result.token);
      }
    } catch (error) {
      next(error);
    }
  };
