import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { responseMiddleware } from "../middlewares/response.middleware";
import { errorMiddleware } from "../middlewares/error.middleware";

export const userRouter = Router();
const userController = new UserController();

userRouter.post(
  "/step-one",
  responseMiddleware(userController.initRegistration.bind(userController)),
  errorMiddleware
);
