import { PassportStatic } from "passport";
import { CustomError } from "./error.util";
import { Identification } from "../types/user.types";
import { Strategy, ExtractJwt, StrategyOptions, VerifiedCallback } from "passport-jwt";

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
};

export const applyPassportStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(options, async (data: Identification, done: VerifiedCallback) => {
      try {
        console.log(data);
        if (data.id) {
          return done(null, data);
        }
        return done(null, false);
      } catch (e) {
        throw new CustomError("Token", "Invalid token", 501);
      }
    })
  );
};
