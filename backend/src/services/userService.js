import userModel from "../models/userModel.js";

export class UserService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    thiis.model = this.sequelizeService.define("User", userModel);
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
