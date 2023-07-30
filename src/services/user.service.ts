import config from "../../knexfile";
import { AuthSucces, FinalStep, InitialStep, Login } from "../types/user.types";
import { Storage, OptionsBuilder } from "ticketwing-storage-util";
import { PasswordUtil } from "../utils/password.util";
import { CheckpointService } from "./checkpoint.service";
import { redisConf } from "../confs/redis.conf";
import { CustomError } from "../utils/error.util";
import { TokenUtil } from "../utils/token.util";

export class UserService {
  private storage: Storage;
  private checkpoint: CheckpointService;
  private password: PasswordUtil;
  private token: TokenUtil;

  constructor() {
    this.storage = new Storage(config.development, redisConf, "users");
    this.checkpoint = new CheckpointService();
    this.password = new PasswordUtil();
    this.token = new TokenUtil();
  }

  async getByEmail(email: string) {
    const options = new OptionsBuilder()
      .setSelect(["email", "password"])
      .setConditions({ email })
      .build();
    const account = await this.storage.get(options);
    return account;
  }

  async initRegistration(data: InitialStep) {
    const options = new OptionsBuilder()
      .setCacheable(true)
      .setReturning(["id", "email"])
      .build();
    const user_id = await this.storage.insert(data, options);
    await this.checkpoint.setState(user_id);
  }

  async finishRegistration(data: FinalStep) {
    const { id, ...userInfo } = data;
    const options = new OptionsBuilder()
      .setCacheable(true)
      .setKey(id)
      .setConditions({ id })
      .build();
    await this.storage.update(userInfo, options);
    await this.checkpoint.setState(id);
  }

  async login(data: Login): Promise<AuthSucces> {
    const [account] = await this.getByEmail(data.email);
    const { id, email, password } = account;
    const hasedEnteredPass = this.password.hash(data.password);
    const similar = this.password.compare(hasedEnteredPass, password);
    const state = await this.checkpoint.getState(id);

    if (!similar) {
      throw new CustomError("Auth Error", "Invalid input!", 403);
    }

    const token = this.token.generate(id, email);

    if (similar && state) {
      return { token };
    }

    return { token, redirect: true, url: "/registration/step/2" };
  }
}
