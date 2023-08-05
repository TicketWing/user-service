import { UserService } from "../services/user.service";
import {
  AuthedExtendedRequest,
  AuthedRequest,
  ExtendedRequest,
} from "../types/request.types";
import { InitialStep, Login } from "../types/user.types";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService().initStorage();
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

  async getById(req: AuthedRequest) {
    const { identification } = req;
    const result = this.service.getById(identification.id);
    return result;
  }

  async getByEmail(req: ExtendedRequest<InitialStep>) {
    const { body } = req;
    const result = this.service.getByEmail(body.email);
    return result;
  }
}
