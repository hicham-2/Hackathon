import userModel from "../models/userModel.js";
import { GenericQuery } from "./serviceQuery.js";

export class UserService extends GenericQuery {
  constructor(sequelizeService) {
    super();
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Users", userModel, {
      tableName: "Users",
    });
  }

  async createUser(user) {
    const res = await this.model.create(user);
    return res;
  }
}
