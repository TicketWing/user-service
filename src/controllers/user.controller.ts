
import { UserService } from "../services/user.service";
import {
  AuthedExtendedRequest,
  AuthedRequest,
  ExtendedRequest,
} from "../types/request.types";
import { InitialStep, Login } from "../types/user.types";

const reg = new UserService();

export class UserController {
  
  private service = new UserService();

  async initRegistration(req: ExtendedRequest<InitialStep>) {
    const { body } = req;
    const result = await this.service.createAccount(body);
    return result;
  }

  async finishRegistration(req: AuthedExtendedRequest<any>) {
    const { body, identification } = req;
    const data = { ...body, ...identification };
    const result = this.service.fillInAccount(data);
    return result;
  }

  async login(req: ExtendedRequest<Login>) {
    const { body } = req;
    const result = await reg.login(body);
    return result;
  }

  async getById(req: AuthedRequest) {
    const { identification } = req;
    const result = reg.getById(identification.id);
    return result;
  }

  async getByEmail(req: ExtendedRequest<InitialStep>) {
    const { body } = req;
    const result = reg.getByEmail(body.email);
    return result;
  }
}
