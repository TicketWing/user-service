import { NextFunction, Response } from "express";
import { CustomError } from "../utils/error.util";

type CheckOptions = {
  fn: any;
  isRequired: boolean;
  key: string;
  storage: string;
};

export const checkExistance =
  (options: CheckOptions) =>
  async (req: any, _res: Response, next: NextFunction) => {
    const { fn, isRequired, key, storage } = options;
    const identificator = req[storage][key];
    const instance = await fn(identificator);

    if (isRequired && instance) {
      return next();
    }

    if (isRequired && !instance) {
      const error = new CustomError("CheckExistance", "Does not exist", 404);
      return next(error);
    }

    if (!isRequired && instance) {
      const error = new CustomError("CheckExistance", "Already exists", 404);
      return next(error);
    }
  };
