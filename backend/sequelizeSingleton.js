import { Sequelize } from "sequelize";

class Database {
  constructor() {
    if (!Database.instance) {
      this.sequelize = new Sequelize(process.env.BDD_ENDPOINT);
      Database.instance = this;
    }

    return Database.instance;
  }

  async authenticate() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully in singleton.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
}

const instance = new Database();
Object.freeze(instance);

export default instance.sequelize;
