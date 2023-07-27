import knex, { Knex } from "knex";
import { RedisUtil } from "./redis.util";
import { CustomError } from "./error.util";

type Condition = {
  [key: string]: any;
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

  async getById<T>(id: string) {
    const cached = await this.redis.get<T>(id);

    if (!cached) {
      const query = this.database(this.tableName).select();
      const result = await this.handler(query, "Error in get");
      return result;
    }

    return cached;
  }

  async insert<T>(data: T): Promise<void> {
    const query = this.database(this.tableName).insert(data).returning("id");
    const inserted = await this.handler(query, "Error in insert");
    const key = inserted[0].id;
    await this.redis.set(key, data);
  }

  async update<T>(key: string, condition: Condition, data: T): Promise<void> {
    const query = this.database(this.tableName).where(condition).update(data);
    await this.handler(query, "Error in update");
    await this.redis.update(key, data);
  }

  async delete(key: string, condition: Condition): Promise<void> {
    const query = this.database.where(condition).del();
    await this.handler(query, "Error in delete");
    await this.redis.delete(key);
  }
}
