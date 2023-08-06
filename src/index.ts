import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import { AppRouters } from "./routers/app.routers";
import { applyPassportStrategy } from "./utils/passport.util";

dotenv.config();

const app = express();
const appRouters = new AppRouters(app);

app.use(passport.initialize());
applyPassportStrategy(passport);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

appRouters.init();

const server = app.listen(8080);

process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});
