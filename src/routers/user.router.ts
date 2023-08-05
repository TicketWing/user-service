import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { responseMiddleware } from "../middlewares/response.middleware";
import { errorMiddleware } from "../middlewares/error.middleware";
import { checkExistance } from "../middlewares/existance.middleware";

export class UserRouter {
  private router: Router;
  private controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
  }

  init() {
    this.addEndpoints();
    return this.router;
  }

  addEndpoints() {
    this.router.post(
      "/step-one",
      // checkExistance({
      //   isRequired: false,
      //   pathToKey: ["body", "email"],
      //   fn: this.controller.getByEmail,
      // }),
      responseMiddleware(this.controller.initRegistration),
      errorMiddleware
    );

    this.router.post(
      "/step-two",
      checkExistance({
        isRequired: true,
        pathToKey: ["identification", "id"],
        fn: this.controller.getById,
      }),
      responseMiddleware(this.controller.finishRegistration),
      errorMiddleware
    );

    this.router.post(
      "/login",
      checkExistance({
        isRequired: false,
        pathToKey: ["body", "email"],
        fn: this.controller.getByEmail,
      }),
      responseMiddleware(this.controller.login),
      errorMiddleware
    );
  }
}
