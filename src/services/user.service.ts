import {
  Login,
  FinalStep,
  AuthTokens,
  InitialStep,
  AuthRedirect,
} from "../types/user.types";
import knexConfig from "../../knexfile";
import { redisConfig } from "../confs/redis.conf";
import { CustomError } from "../utils/error.util";
import { PasswordUtil } from "../utils/password.util";
import { TokenService } from "./token.service";
import { CheckpointService } from "./checkpoint.service";
import { Storage, OptionsBuilder } from "ticketwing-storage-util";

export class UserService {
  private token: TokenService;
  private storage: Storage;
  private password: PasswordUtil;
  private checkpoint: CheckpointService;

  constructor() {
    this.token = new TokenService();
    this.password = new PasswordUtil();
    this.checkpoint = new CheckpointService();
    this.storage = new Storage(knexConfig.development, redisConfig, "users");
  }

  async getById(id: string) {
    const account = await this.storage.getCache(id);
    return account;
  }

  async getByEmail(email: string) {
    const options = new OptionsBuilder()
      .setSelect(["email", "password"])
      .setConditions({ email })
      .build();
    const account = await this.storage.get(options);
    return account;
  }

  async initRegistration(data: InitialStep): Promise<AuthRedirect> {
    const options = new OptionsBuilder()
      .setCacheable(true)
      .setReturning(["id", "email"])
      .build();
    const id = await this.storage.insert(data, options);
    await this.checkpoint.setState(id);
    const encodedData = { id, email: data.email };
    const accessToken = this.token.getAccessToken(encodedData);
    return { accessToken, redirect: true, url: "/registration/step/2" };
  }

  async finishRegistration(data: FinalStep): Promise<AuthTokens> {
    const { id, email, ...info } = data;
    const options = new OptionsBuilder()
      .setCacheable(true)
      .setKey(id)
      .setConditions({ id })
      .build();
    await this.storage.update(info, options);
    await this.checkpoint.setState(id);
    const tokens = await this.token.getTokens({ id, email });
    return tokens;
  }

  async login(data: Login): Promise<AuthRedirect | AuthTokens> {
    const records = await this.getByEmail(data.email);
    const { password, ...encoded } = records[0];
    const similar = this.password.compare(data.password, password);
    const state = await this.checkpoint.getState(encoded.id);

    if (!similar) {
      throw new CustomError("Auth Error", "Invalid input!", 403);
    }

    if (similar && state) {
      const tokens = this.token.getTokens(encoded);
      return tokens;
    }

    const accessToken = this.token.getAccessToken(encoded);
    return { accessToken, redirect: true, url: "/registration/step/2" };
  }
}
