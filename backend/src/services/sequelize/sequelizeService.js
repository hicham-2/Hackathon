import { Sequelize } from "sequelize";
import { UserService } from "../userService.js";
import { RoomService } from "../roomService.js";
import { CourseService } from "../courseService.js";
import { SlotService } from "../slotService.js";
import { NotificationService } from "../notificationService.js";
import { AvailabilityService } from "../availabilityService.js";
import { ProfessorSpecialityService } from "../professorSpecialityService.js";
import { ClasseService } from "../classeService.js";
import { SectorService } from "../sectorService.js";

export class SequelizeService {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this.userService = new UserService(this);
    this.notificationService = new NotificationService(this);
    this.roomService = new RoomService(this);
    this.professorSpecialityService = new ProfessorSpecialityService(this);
    this.courseService = new CourseService(this);
    this.slotService = new SlotService(this);
    this.availabilityService = new AvailabilityService(this);
    this.classeService = new ClasseService(this);
    this.sectorService = new SectorService(this);
  }

  defineAssociations() {
    this.userService.model.hasMany(this.notificationService.model, {
      foreignKey: "user_id",
      as: "notifications",
    });

    this.roomService.model.hasMany(this.slotService.model, {
      foreignKey: "room_id",
      as: "slots",
    });

    this.courseService.model.hasMany(this.slotService.model, {
      foreignKey: "course_id",
      as: "slots",
    });

    this.classeService.model.hasMany(this.slotService.model, {
      foreignKey: "classe_id",
      as: "classe",
    });

    this.sectorService.model.hasMany(this.classeService.model, {
      foreignKey: "sector_id",
      as: "sector",
    });

    this.userService.model.hasMany(this.availabilityService.model, {
      foreignKey: "user_id",
      as: "availabilities",
      onDelete: "CASCADE",
    });

    this.notificationService.model.belongsTo(this.userService.model, {
      foreignKey: "user_id",
      as: "Users",
      onDelete: "CASCADE",
    });

    this.availabilityService.model.belongsTo(this.userService.model, {
      foreignKey: "user_id",
      as: "user",
    });

    this.slotService.model.belongsTo(this.roomService.model, {
      foreignKey: "room_id",
      as: "room",
    });

    this.slotService.model.belongsTo(this.courseService.model, {
      foreignKey: "course_id",
      as: "course",
    });

    this.slotService.model.belongsTo(this.classeService.model, {
      foreignKey: "classe_id",
      as: "classe",
    });

    this.classeService.model.hasMany(this.sectorService.model, {
      foreignKey: "sector_id",
      as: "sector",
    });


    this.userService.model.belongsToMany(this.courseService.model, {
      through: this.professorSpecialityService.model,
      foreignKey: "user_id", // Column in ProfessorSpeciality referencing Professors
      otherKey: "course_id", // Column in ProfessorSpeciality referencing Courses
      as: "courses", // Alias for courses associated with a professor
    });

    this.courseService.model.belongsToMany(this.userService.model, {
      through: this.professorSpecialityService.model,
      foreignKey: "course_id", // Column in ProfessorSpeciality referencing Courses
      otherKey: "user_id", // Column in ProfessorSpeciality referencing Professors
      as: "professors", // Alias for professors associated with a course
    });
  }

  async synchronize() {
    await this.sequelize.sync({ force: true });
    //  await this.sequelize.sync({ alter: true });
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
