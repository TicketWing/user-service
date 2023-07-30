import { UserService } from "../services/user.service";
import { AuthedExtendedRequest, ExtendedRequest } from "../types/request.types";
import { InitialStep, Login } from "../types/user.types";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  async initRegistration(req: ExtendedRequest<InitialStep>) {
    const { body } = req;
    const result = await this.service.initRegistration(body);
    return result;
  }

  async finishRegistration(req: AuthedExtendedRequest<any>) {
    const { body, identification } = req;
    const data = { ...body, ...identification };
    const result = this.service.finishRegistration(data);
    return result;
  }

  async login(req: ExtendedRequest<Login>) {
    const { body } = req;
    const result = await this.service.login(body);
    return result;
  }
}
