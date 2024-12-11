import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { UserController } from "./controllers/userController.js";

dotenv.config();

const app = express();
const userController = new UserController();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/user', userController.buildRouter());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}`);
});
