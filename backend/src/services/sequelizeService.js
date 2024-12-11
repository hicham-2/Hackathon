import { Sequelize } from "sequelize";
import { UserService } from "./userService.js";
import { NotificationService } from "./notificationService.js";

export class SequelizeService {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.userService = new UserService(this);
    this.notificationService = new NotificationService(this);
  }

  defineAssociations() {
    this.notificationService.model.belongsTo(this.userService.model, {
      foreignKey: "user_id",
      as: "user",
      onDelete: "CASCADE",
    });

    this.userService.model.hasMany(this.notificationService.model, {
      foreignKey: "user_id",
      as: "notifications",
    });
  }

  async synchronize() {
    await this.sequelize.sync({ force: true });
  }

  static async get() {
    if (this.instance !== undefined) {
      return this.instance;
    }
    const connection = await this.openConnection();
    this.instance = new SequelizeService(connection);

    this.instance.defineAssociations();
    this.instance.synchronize();

    return this.instance;
  }

  static async openConnection() {
    try {
      return new Sequelize(process.env.BDD_ENDPOINT);
    } catch (error) {
      console.error("Failed to establish a database connection:", error);
      throw error;
    }
  }
}
