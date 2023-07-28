import config from "../../knexfile";
import { DatabaseUtil } from "../utils/database.util";
import { CheckpointService } from "./checkpoint.service";

type initialRegistration = {
  email: string;
  password: string;
};

type finalRegistration = {
  id: string;
  email: string;
  age: number;
  name: string;
};

export class UserService {
  private database: DatabaseUtil;
  private checkpoint: CheckpointService;

  constructor() {
    this.database = new DatabaseUtil(config.development, "users");
    this.checkpoint = new CheckpointService();
  }

  async initRegistration(data: initialRegistration) {
    const options = { cacheable: false };
    const user_id = await this.database.insert(data, options);
    await this.checkpoint.setState(user_id);
  }

  async finishRegistration(data: finalRegistration) {
    const { id, ...userInfo } = data;
    const conditions = { id };
    const options = { key: id, conditions };
    await this.database.update(options, userInfo);
    await this.checkpoint.setState(id);
  }

  async login() {
    // Проблема: нельзя хранить в cache пароль пользователей!
  }
}
