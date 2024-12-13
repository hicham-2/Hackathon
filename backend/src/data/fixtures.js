import sequelize_fixtures from "sequelize-fixtures";
import path from "path";
import { fileURLToPath } from "url";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadFixtures = async () => {
  try {
    const sequelizeService = await SequelizeService.get();

    const models = [
      sequelizeService.userService.model, //  0
      sequelizeService.roomService.model, //  1
      sequelizeService.sectorService.model, //  2
      sequelizeService.classeService.model, //  3
      sequelizeService.courseService.model, //  4
      sequelizeService.professorSpecialityService.model, //  5
      sequelizeService.slotService.model, //  6
      sequelizeService.availabilityService.model, //  7
      sequelizeService.notificationService.model, //  8
    ];

    const fixturePath = path.resolve(__dirname, "fixtures_all_db.json");

    sequelizeService.sequelize.drop();

    const data = await sequelize_fixtures.loadFile(fixturePath, models);
    return data;
  } catch (error) {
    console.error("error loading fixtures", error);
    return false;
  }
};

loadFixtures();
