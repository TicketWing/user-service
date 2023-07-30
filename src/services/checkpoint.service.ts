import { OptionsBuilder, Storage } from "ticketwing-storage-util";
import config from "../../knexfile";
import { redisConf } from "../confs/redis.conf";

type Checkpoint = {
  user_id: string;
  isFinished?: boolean;
};

export class CheckpointService {
  private table = "checkpoints";
  private database: Storage;

  constructor() {
    this.database = new Storage(config.development, redisConf, this.table);
  }

  async setState(user_id: string) {
    const options = new OptionsBuilder()
      .setConditions({ user_id })
      .setSelect(["isFinished"])
      .build();
    const records = await this.database.get(options);

    if (!records.length) {
      const data = { user_id };
      const options = new OptionsBuilder().build();
      await this.database.insert(data, options);
      return;
    }

    const data = { ...records[0] };
    data.isFinished = !data.isFinished;
    await this.database.update<Checkpoint>(data, options);
  }

  async getState(user_id: string) {
    const options = new OptionsBuilder()
      .setConditions({ user_id })
      .setSelect(["isFinished"])
      .build();

    const record = await this.database.get(options);
    const state = record[0].isFinished;
    return state;
  }
}
