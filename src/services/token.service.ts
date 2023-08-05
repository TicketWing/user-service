import { TokenUtil } from "../utils/token.util";
import { Identification } from "../types/user.types";
import {
  InsertCacheOptions,
  InsertDBOptions,
  OptionsBuilder,
  Storage,
} from "ticketwing-storage-util";
import { databasePool, redisClient } from "../connections/storage";

export class TokenService {
  private table = "tokens";
  private storage!: Storage;
  private util: TokenUtil;

  constructor() {
    this.util = new TokenUtil();
  }

  initStorage() {
    this.storage = new Storage(databasePool, redisClient, this.table);
    return this;
  }

  getAccessToken(value: Identification) {
    return this.util.getAccessToken(value);
  }

  async getTokens(value: Identification) {
    const { accessToken, refreshToken } = this.util.getTokens(value);
    const data = { user_id: value.id, refreshToken };
    const dbOptions = { returning: ["user_id", "token"] };
    const cacheOptions = { keyField: "user_id", cachedFields: ["token"] };

    const options = new OptionsBuilder<InsertDBOptions, InsertCacheOptions>(
      dbOptions
    )
      .setCacheOptions(cacheOptions)
      .build();

    await this.storage.insert(data, options);
    return { accessToken, refreshToken };
  }
}
