import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { AppRouters } from "./routers/app.routers";

dotenv.config();

const app = express();
const appRouters = new AppRouters(app);

app.use(bodyParser.urlencoded({ extended: false }));

appRouters.init();

const server = app.listen(3000, () =>
  console.log(`Server started on port ${3000}`)
);

process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});
