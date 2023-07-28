import knex, { Knex } from "knex";
import { RedisUtil } from "./redis.util";
import { CustomError } from "./error.util";

type Options = {
  key?: string;
  cacheable?: boolean;
};

type ExtendedOptions = Options & {
  conditions: {
    [key: string]: string;
  };
  rows?: string[];
};

export class DatabaseUtil {
  private redis: RedisUtil;
  private database: Knex<any, unknown[]>;
  private tableName: string;

  constructor(config: any, tableName: string) {
    this.redis = new RedisUtil();
    this.database = knex(config);
    this.tableName = tableName;
  }

  private async handler<T>(promise: Promise<T>, msg: string): Promise<T> {
    try {
      const result = await promise;
      return result;
    } catch (error) {
      throw new CustomError("Database", msg, 500);
    }
  }

  async get<T>(options: ExtendedOptions): Promise<any[]> {
    const { conditions, rows } = options;
    const response = await this.database
      .where(conditions)
      .select(...(rows || []));
    return response;
  }

  async getCache<T>(id: string) {
    const cached = await this.redis.get<T>(id);

    if (!cached) {
      const query = this.database(this.tableName).select();
      const result = await this.handler(query, "Error in get");
      return result;
    }

    return cached;
  }

  async insert<T>(data: T, options: Options): Promise<string> {
    const { cacheable } = options;
    const query = this.database(this.tableName).insert(data).returning("id");
    const inserted = await this.handler(query, "Error in insert");
    const key = inserted[0].id;

    if (cacheable) {
      await this.redis.set(key, data);
    }

    return key;
  }

  async update<T>(options: ExtendedOptions, data: T): Promise<void> {
    const { key, conditions } = options;
    const query = this.database(this.tableName).where(conditions).update(data);
    await this.handler(query, "Error in update");

    if (key) {
      await this.redis.update(key, data);
    }
  }

  async delete(options: ExtendedOptions): Promise<void> {
    const { key, conditions } = options;
    const query = this.database.where(conditions).del();
    await this.handler(query, "Error in delete");

    if (key) {
      await this.redis.delete(key);
    }
  }
}
