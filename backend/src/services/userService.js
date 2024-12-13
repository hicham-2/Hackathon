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

 
  async findOne(email) {
    const user = await this.model.findOne({
      where: {
        email: email,
      },
    });
  
    return user;
  }

  async findAll() {
    const users = await this.model.findAll();
    return users;
  }

  async deleteUser(id) {
    const res = await this.model.destroy({
      where: { id: id },
    });

    return res;
  }

   async findUserById(id) {
    try {
      return await this.model.findByPk(id);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      throw error;
    }
  }


 
}
