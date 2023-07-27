import { Redis } from "ioredis";
import { redisConf } from "../confs/redis.conf";

export class RedisUtil {
  private client: Redis;

  constructor() {
    this.client = new Redis(redisConf);
  }

  stringify<T>(data: T): string {
    return JSON.stringify(data);
  }

  parse<T>(data: string): T {
    return JSON.parse(data);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (data) {
      return this.parse<T>(data);
    }

    return null;
  }

  async set<T>(key: string, data: T): Promise<void> {
    const stringifiedData = this.stringify(data);
    await this.client.set(key, stringifiedData);
  }

  async update<I, T>(key: string, data: T): Promise<void> {
    const record = await this.get<any>(key);

    if (!record) return;

    for (const field in data) {
      if (record[field] !== undefined) {
        record[field] = data[field];
      }
    }

    await this.set<any>(key, record);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
