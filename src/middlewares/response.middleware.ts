/* eslint-disable indent */
import { NextFunction, Response } from "express";

export const responseMiddleware =
  (cb: any) =>
  async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await cb(req);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
