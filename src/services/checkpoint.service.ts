import config from "../../knexfile";
import { DatabaseUtil } from "../utils/database.util";

type Checkpoint = {
  user_id: string;
  isFinished?: boolean;
};

export class CheckpointService {
  private table = "checkpoints";
  private database: DatabaseUtil;

  constructor() {
    this.database = new DatabaseUtil(config.development, this.table);
  }

  async setState(user_id: string) {
    const rows = ["isFinished"];
    const conditions = { user_id };
    const options = { conditions, rows };
    const records = await this.database.get(options);

    if (!records.length) {
      const data = { user_id };
      const options = { cacheable: false };
      await this.database.insert(data, options);
      return;
    }

    const data = { ...records[0] };
    data.isFinished = !data.isFinished;
    await this.database.update<Checkpoint>(options, data);
  }
}
