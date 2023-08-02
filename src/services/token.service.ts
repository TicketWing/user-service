import knexConfig from "../../knexfile";
import { redisConfig } from "../confs/redis.conf";
import { TokenUtil } from "../utils/token.util";
import { Identification } from "../types/user.types";
import { OptionsBuilder, Storage } from "ticketwing-storage-util";
import { InsertDBOptions } from "ticketwing-storage-util/src/types/database.types";
import { InsertCacheOptions } from "ticketwing-storage-util/src/types/cache.types";

export class TokenService {
  private table = "tokens";
  private storage: Storage;
  private util: TokenUtil;

  constructor() {
    this.storage = new Storage(knexConfig.development, redisConfig, this.table);
    this.util = new TokenUtil();
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
      .setCacheable(true)
      .setCacheOptions(cacheOptions)
      .build();

    await this.storage.insert(data, options);
    return { accessToken, refreshToken };
  }
}
