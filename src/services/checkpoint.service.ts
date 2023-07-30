import knexConfig from "../../knexfile";
import { redisConfig } from "../confs/redis.conf";
import { Checkpoint } from "../types/checkpoint.types";
import { OptionsBuilder, Storage } from "ticketwing-storage-util";

export class CheckpointService {
  private table = "checkpoints";
  private storage: Storage;

  constructor() {
    this.storage = new Storage(knexConfig.development, redisConfig, this.table);
  }

  async setState(user_id: string) {
    const options = new OptionsBuilder()
      .setConditions({ user_id })
      .setSelect(["isFinished"])
      .build();
    const records = await this.storage.get(options);

    if (!records.length) {
      const data = { user_id };
      const options = new OptionsBuilder().build();
      await this.storage.insert(data, options);
      return;
    }

    const data = { ...records[0] };
    data.isFinished = !data.isFinished;
    await this.storage.update<Checkpoint>(data, options);
  }

  async getState(user_id: string) {
    const options = new OptionsBuilder()
      .setConditions({ user_id })
      .setSelect(["isFinished"])
      .build();

    const record = await this.storage.get(options);
    const state = record[0].isFinished;
    return state;
  }
}
