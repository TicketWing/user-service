import { Application } from "express";
import { UserRouter } from "./user.router";

export class AppRouters {
  private app: Application;
  private userRouter: UserRouter;

  constructor(app: Application) {
    this.app = app;
    this.userRouter = new UserRouter();
  }

  init() {
    this.app.use(this.userRouter.init());
  }
}
