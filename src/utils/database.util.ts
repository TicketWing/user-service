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

  async insert<T>(data: T): Promise<void> {
    try {
      const inserted = await this.database(this.tableName)
        .insert(data)
        .returning("id");
      const key = inserted[0].id;
      await this.redis.set(key, data);
    } catch (error) {
      throw new CustomError("Database", "Error in insert", 500);
    }
  }

  async update<T>(key: string, condition: Condition, data: T): Promise<void> {
    try {
      await this.database(this.tableName).where(condition).update(data);
      await this.redis.update(key, data);
    } catch (error) {
      throw new CustomError("Database", "Error in update", 500);
    }
  }

  async delete(key: string, condition: Condition): Promise<void> {
    try {
      await this.database.where(condition).del();
      await this.redis.delete(key);
    } catch (error) {
      throw new CustomError("Database", "Error in delete", 500);
    }
  }
}
