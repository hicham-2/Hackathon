import sequelize_fixtures from "sequelize-fixtures";
import path from "path";
import { fileURLToPath } from "url";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelizeService = await SequelizeService.get();

const models = [
  sequelizeService.roomService.model, //  0
  sequelizeService.sectorService.model, //  1
  sequelizeService.classeService.model, //  2
  sequelizeService.courseService.model, //  3
  sequelizeService.slotService.model, //  4
  sequelizeService.availabilityService.model, //  5
  sequelizeService.professorSpecialityService.model, //  6
  sequelizeService.notificationService.model, //  7
];

const loadFixtures = async () => {
  try {
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
