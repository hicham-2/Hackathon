import userModel from "../models/userModel";
import { SequelizeService } from "./sequelizeService";

export class UserService {
  constructor(sequelizeService) {
    this.sequelizeService = SequelizeService;
    const sequelizeService = this.sequelizeService.sequelize;

    thiis.model = sequelizeService.define("User", userModel);
  }

  async createUser(user) {
    const res = await this.model.create(user);
    return res;
  }

  async findUser(email, password) {
    const user = await this.model.findOne({
      email: email,
      password: password,
    });

    return user;
  }
}
