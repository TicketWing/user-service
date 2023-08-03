import knexConfig from "../../knexfile";
import { redisConfig } from "../confs/redis.conf";
import { Checkpoint } from "../types/checkpoint.types";
import {
  GetDBOptions,
  InsertDBOptions,
  OptionsBuilder,
  Storage,
  UpdateDBOptions,
} from "ticketwing-storage-util";

export class CheckpointService {
  private table = "checkpoints";
  private storage: Storage;

  constructor() {
    this.storage = new Storage(knexConfig.development, redisConfig, this.table);
  }

  async setState(user_id: string) {
    const getDbOptions = { where: { user_id }, select: ["isFinished"] };

    const getOptions = new OptionsBuilder<GetDBOptions, undefined>(
      getDbOptions
    ).build();

    const records = await this.storage.get(getOptions);

    if (!records.length) {
      const data = { user_id };
      const insertDbOptions = { returning: [] };

      const options = new OptionsBuilder<InsertDBOptions, undefined>(
        insertDbOptions
      ).build();

      await this.storage.insert(data, options);
      return;
    }

    const data = { ...records[0] };
    data.isFinished = !data.isFinished;
    const updateDbOptions = { where: { user_id } };

    const updateOptions = new OptionsBuilder<UpdateDBOptions, undefined>(
      updateDbOptions
    ).build();

    await this.storage.update<Checkpoint>(data, updateOptions);
  }

  async getState(user_id: string) {
    const dbOptions = { where: { user_id }, select: ["isFinished"] };

    const options = new OptionsBuilder<GetDBOptions, undefined>(
      dbOptions
    ).build();

    const record = await this.storage.get(options);
    return record[0].isFinished;
  }
}
