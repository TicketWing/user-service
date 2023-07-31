import { NextFunction, Response } from "express";
import { CustomError } from "../utils/error.util";
import { CheckOptions } from "../types/middlewares.types";

const getKey = (pathToKey: string[], req: any) => {
  let tmp = req;

  for (const field of pathToKey) {
    if (tmp && tmp[field]) {
      tmp = tmp[field];
      continue;
    }
    return undefined;
  }

  return tmp;
};

export const checkExistance =
  (options: CheckOptions) =>
  async (req: any, _res: Response, next: NextFunction) => {
    const { fn, isRequired, pathToKey } = options;
    const key = getKey(pathToKey, req);
    const instance = await fn(key);

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
