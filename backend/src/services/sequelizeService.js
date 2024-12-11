import { Sequelize } from "sequelize";
import { UserService } from "./userService.js";

export class SequelizeService {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.userService = new UserService(this);
  }

  defineAssociations() {
    this.userService.model.hasOne(this.professorService.model, {
      foreignKey: "user_id",
      as: "professor",
      onDelete: "CASCADE",
    });
  
    this.professorService.model.belongsTo(this.userService.model, {
      foreignKey: "user_id",
      as: "user",
    });
  
    this.professorService.model.belongsTo(this.specialityService.model, {
      foreignKey: "speciality_id",
      as: "speciality",
    });
  
    this.specialityService.model.hasMany(this.professorService.model, {
      foreignKey: "speciality_id",
      as: "professors",
    });
  

    this.professorService.model.hasMany(this.unavailabilityService.model, {
      foreignKey: "professor_id",
      as: "unavailabilities",
    });
  
    this.unavailabilityService.model.belongsTo(this.professorService.model, {
      foreignKey: "professor_id",
      as: "professor",
    });
  
    
    this.professorService.model.belongsToMany(this.specialityService.model, {
      through: this.professorSpecialityService.model,
      foreignKey: "professor_id",
      otherKey: "speciality_id",
      as: "specialities",
    });
  
    this.specialityService.model.belongsToMany(this.professorService.model, {
      through: this.professorSpecialityService.model, 
      foreignKey: "speciality_id",
      otherKey: "professor_id",
      as: "professors",
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
