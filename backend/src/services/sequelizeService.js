import { Sequelize } from "sequelize";
import { UserService } from "./userService.js";

export class SequelizeService {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.userService = new UserService(this);
    this.synchronize();
  }

  static async get() {
    if (this.instance !== undefined) {
      return this.instance;
    }
    const connection = await this.openConnection();
    this.instance = new SequelizeService(connection);

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

  static async synchronize() {
    await this.sequelize.sync({ force: true });
  }
}
