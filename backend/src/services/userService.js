import userModel from "../models/userModel.js";

export class UserService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Users", userModel, {
      tableName: "Users",
    });
  }

  async createUser(user) {
    const res = await this.model.create(user);
    return res;
  }

  async findUser(email, password) {
    const user = await this.model.findOne({
      where: {
        email: email,
        password: password,
      },
    });

    return user;
  }

  async findOneBy(object) {
    const user = await this.model.findOne({
      where: object,
    });

    return user;
  }
}
