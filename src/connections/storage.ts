import knex from "knex";
import knexConfig from "../../knexfile";
import { Redis } from "ioredis";
import { redisConfig } from "../confs/redis.conf";

export const databasePool = knex(knexConfig.development);
export const redisClient = new Redis(redisConfig);
