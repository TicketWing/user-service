import knexConfig from "../../knexfile";
import { redisConfig } from "../confs/redis.conf";
import { TokenUtil } from "../utils/token.util";
import { Identification } from "../types/user.types";
import { OptionsBuilder, Storage } from "ticketwing-storage-util";

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
    const insertable = { user_id: value.id, refreshToken };
    const options = new OptionsBuilder()
      .setCacheable(true)
      .setReturning(["id", "refreshToken"])
      .build();
    await this.storage.insert(insertable, options);
    return { accessToken, refreshToken };
  }
}
