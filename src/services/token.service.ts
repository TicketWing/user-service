import { TokenUtil } from "../utils/token.util";
import { Identification } from "../types/user.types";
import {
  InsertCacheOptions,
  InsertDBOptions,
  OptionsBuilder,
  Storage,
  UpdateDBOptions,
} from "ticketwing-storage-util";
import { databasePool, redisClient } from "../connections/storage";

export class TokenService {
  private table = "tokens";
  private storage: Storage;
  private util: TokenUtil;

  constructor() {
    this.util = new TokenUtil();
    this.storage = new Storage(databasePool, redisClient, this.table);
  }

  decodeToken(token: string) {
    const decodedData = this.util.decodeToken(token);
    return decodedData;
  }

  getAccessToken(value: Identification) {
    return this.util.getAccessToken(value);
  }

  async getTokens(value: Identification) {
    const { accessToken, refreshToken } = this.util.getTokens(value);
    const data = { user_id: value.id, refreshToken };
    const dbOptions = { returning: ["user_id", "refreshToken"] };
    const cacheOptions = {
      keyField: "user_id",
      cachedFields: ["refreshToken"],
    };

    const options = new OptionsBuilder<InsertDBOptions, InsertCacheOptions>(
      dbOptions
    )
      .setCacheOptions(cacheOptions)
      .build();

    await this.storage.insert(data, options);
    return { accessToken, refreshToken };
  }

  async updateTokens(value: Identification) {
    const { accessToken, refreshToken } = this.util.getTokens(value);
    const dbOptions = { where: { user_id: value.id } };

    const options = new OptionsBuilder<UpdateDBOptions, undefined>(
      dbOptions
    ).build();

    await this.storage.update({ refreshToken }, options);
    return { accessToken, refreshToken };
  }
}
