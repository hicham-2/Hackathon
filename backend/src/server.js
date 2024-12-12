import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { UserController } from "./controllers/userController.js";
import { RoomController } from "./controllers/roomController.js";
import { CourseController } from "./controllers/courseController.js";
import { EmailService } from "./services/emailService.js";

dotenv.config();

const app = express();
const userController = new UserController();
const roomController = new RoomController();
const courseController = new CourseController();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/user', userController.buildRouter());
app.use('/room', roomController.buildRouter());
app.use('/course', courseController.buildRouter());


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body; 

  const emailService = new EmailService();

  try {
    const emailResponse = await emailService.sendEmail({ to, subject, text, html });
    res.status(200).send({ message: "E-mail envoyé avec succès", info: emailResponse });
  } catch (error) {
    res.status(500).send({ message: "Erreur lors de l'envoi de l'e-mail", error: error.message });
  }
});

app.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}`);
});


