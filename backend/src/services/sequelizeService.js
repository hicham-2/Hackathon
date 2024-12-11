import { Sequelize } from "sequelize";
import { UserService } from "./userService.js";
import { RoomService } from "./roomService.js";
import { CourseService } from "./courseService.js";
import { SlotService } from "./slotService.js";

export class SequelizeService {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.userService = new UserService(this);
    this.roomService = new RoomService(this);
    this.courseService = new CourseService(this);
    this.slotService = new SlotService(this);
  }

  setupAssociations() {
    this.roomService.model.hasMany(this.slotService.model, {
      foreignKey: "room_id",
      as: "slots", 
    });
    this.slotService.model.belongsTo(this.roomService.model, {
      foreignKey: "room_id",
      as: "room", 
    });
  
    this.courseService.model.hasMany(this.slotService.model, {
      foreignKey: "course_id",
      as: "slots",
    });
  
    this.slotService.model.belongsTo(this.courseService.model, {
      foreignKey: "course_id",
      as: "course",
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
    this.instance.setupAssociations();
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
