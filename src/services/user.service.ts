import {
  Login,
  FinalStep,
  AuthTokens,
  InitialStep,
  AuthRedirect,
} from "../types/user.types";
import { CustomError } from "../utils/error.util";
import { PasswordUtil } from "../utils/password.util";
import { TokenService } from "./token.service";
import { CheckpointService } from "./checkpoint.service";
import {
  Storage,
  OptionsBuilder,
  GetDBOptions,
  GetCacheOptions,
  InsertDBOptions,
  InsertCacheOptions,
  UpdateDBOptions,
  UpdateCacheOptions,
} from "ticketwing-storage-util";
import { databasePool, redisClient } from "../connections/storage";
import { Cookies } from "../types/request.types";

export class UserService {
  private table = "users";
  private token: TokenService;
  private storage: Storage;
  private password: PasswordUtil;
  private checkpoint: CheckpointService;

  constructor() {
    this.token = new TokenService();
    this.password = new PasswordUtil();
    this.checkpoint = new CheckpointService();
    this.storage = new Storage(databasePool, redisClient, this.table);
  }

  async getById(id: string) {
    const select = ["email", "password"];
    const cachedFields = select;

    const options = new OptionsBuilder<GetDBOptions, GetCacheOptions>({
      where: { id },
      select,
    })
      .setCacheOptions({ cacheKey: id, cachedFields })
      .build();

    const account = await this.storage.get(options);
    return account;
  }

  async getByEmail(email: string) {
    const dbOptions = { where: { email }, select: ["id", "email", "password"] };

    const options = new OptionsBuilder<GetDBOptions, GetCacheOptions>(
      dbOptions
    ).build();

    const account = await this.storage.get(options);
    return account;
  }

  async createAccount(data: InitialStep): Promise<AuthRedirect> {
    const dbOptions = { returning: ["id", "email", "name", "age"] };
    const cacheOptions = {
      keyField: "id",
      cachedFields: ["email", "name", "age"],
    };

    const options = new OptionsBuilder<InsertDBOptions, InsertCacheOptions>(
      dbOptions
    )
      .setCacheOptions(cacheOptions)
      .build();

    data.password = this.password.hash(data.password);
    const id = await this.storage.insert(data, options);
    await this.checkpoint.setState(id);
    const encodedData = { id, email: data.email };
    const accessToken = this.token.getAccessToken(encodedData);
    return { accessToken, url: "/registration/step-two" };
  }

  async fillInAccount(data: FinalStep): Promise<AuthTokens> {
    const { id, email, ...info } = data;
    const dbOptions = { where: { id, email } };
    const cacheOptions = { cacheKey: id, updatingFields: ["age", "number"] };

    const options = new OptionsBuilder<UpdateDBOptions, UpdateCacheOptions>(
      dbOptions
    )
      .setCacheOptions(cacheOptions)
      .build();

    await this.storage.update(info, options);
    await this.checkpoint.setState(id);
    const tokens = await this.token.getTokens({ id, email });
    return tokens;
  }

  async login(data: Login): Promise<AuthRedirect | AuthTokens> {
    const records = await this.getByEmail(data.email);
    const { password, ...encoded }: any = records;
    const similar = this.password.compare(data.password, password);
    const state = await this.checkpoint.getState(encoded.id);

    if (!similar) {
      throw new CustomError("Auth Error", "Invalid input!", 403);
    }

    if (similar && state) {
      const tokens = this.token.updateTokens(encoded);
      return tokens;
    }

    const accessToken = this.token.getAccessToken(encoded);
    return { accessToken, url: "/registration/step-two" };
  }

  async refresh(cookies: Cookies) {
    const { refreshToken } = cookies;
    const decodedData = this.token.decodeToken(refreshToken);

    if (typeof decodedData === "string") {
      throw new CustomError("Token Error", "Expired refresh token", 401);
    }

    const encodedData = { id: decodedData.id, email: decodedData.email };
    const tokens = await this.token.updateTokens(encodedData);
    return tokens;
  }
}
