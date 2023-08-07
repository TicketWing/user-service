import passport from "passport";
import { CustomError } from "../utils/error.util";
import { NextFunction, Request, Response } from "express";
import { Identification } from "../types/user.types";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, data: Identification, info: any) => {
      if (err) {
        return next(err);
      }

      if (!data) {
        const error = new CustomError("Token", "Wrong token", 401);
        return next(error);
      }

      if (info && info.name === "TokenExpiredError") {
        const error = new CustomError("Token", "Expired", 401);
        return next(error);
      }

      const { id, email } = data;
      req.identification = { id, email };
      next();
    }
  )(req, res, next);
};
