import notificationModel from "../models/notificationModel.js";

export class NotificationService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;
    this.model = this.sequelizeService.define(
      "Notification",
      notificationModel
    );
  }

  async createUser(user) {
    const res = await this.model.create(user);
    return res;
  }

  async findNotification(email, password) {
    const user = await this.model.findOne({
      email: email,
      password: password,
    });

    return user;
  }

  async findOne(email) {
    const user = await this.model.findOne({
      email: email,
    });

    return user;
  }
}
