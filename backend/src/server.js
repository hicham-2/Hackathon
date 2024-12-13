import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { CourseController } from "./controllers/courseController.js";
import { EmailController } from "./controllers/emailController.js";
import { RoomController } from "./controllers/roomController.js";
import { UserController } from "./controllers/userController.js";
import { canAccessDashboard } from "./middleware/is-admin.js";
import { authMiddleware } from "./middleware/is-auth.js";
import { AvailabilityController } from "./controllers/availabilityController.js";
import { SectorController } from "./controllers/sectorController.js";

dotenv.config();

const app = express();
const userController = new UserController();
const roomController = new RoomController();
const courseController = new CourseController();
const emailController = new EmailController();
const availabilityController = new AvailabilityController();
const sectorController = new SectorController();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/user', userController.buildRouter());
app.use('/room', roomController.buildRouter());
app.use('/course', courseController.buildRouter());
app.use('/availabilities', availabilityController.buildRouter());
app.use('/sector', sectorController.buildRouter());
app.get(
  "/admin/dashboard",
  authMiddleware, // Vérifie que le token est valide
  canAccessDashboard, // Vérifie que l'utilisateur est admin
  (req, res) => {
    res.status(200).json({ message: "Bienvenue sur le tableau de bord admin !" });
  }
);



const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.post('/send-email', emailController.sendEmail.bind(emailController));

app.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}`);
});


