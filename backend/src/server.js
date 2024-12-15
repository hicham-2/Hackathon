import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { CourseController } from "./controllers/courseController.js";
import { EmailController } from "./controllers/emailController.js";
import { RoomController } from "./controllers/roomController.js";
import { UserController } from "./controllers/userController.js";
import { PlanningController } from "./controllers/planningController.js";
import { AvailabilityController } from "./controllers/availabilityController.js";
import { SectorController } from "./controllers/sectorController.js";
import { SequelizeService } from "./services/sequelize/sequelizeService.js";
import { ProfessorSpecialityController } from "./controllers/professorSpecialityController.js";


dotenv.config();

const app = express();
const userController = new UserController();
const roomController = new RoomController();
const courseController = new CourseController();
const availabilityController = new AvailabilityController();
const sectorController = new SectorController();
const professorSpecialityController = new ProfessorSpecialityController();
const planningController = new PlanningController();


// Middleware
app.use(cors());
app.use(express.json());

app.use('/user', userController.buildRouter());
app.use('/room', roomController.buildRouter());
app.use('/course', courseController.buildRouter());
app.use('/availabilities', availabilityController.buildRouter());
app.use('/professor-speciality', professorSpecialityController.buildRouter());
app.use('/sector', sectorController.buildRouter());
app.use('/planning', planningController.buildRouter());


const PORT = process.env.PORT || 3000;



app.listen(PORT, async () => {
  const sequelizeService = await SequelizeService.get();

  console.log(`Server is running on port ${PORT}`);
});
