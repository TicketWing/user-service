import { Application } from 'express';
import { userRouter } from './user.router';

export class AppRouters {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  init() {
    this.app.use(userRouter);
  }
}
