import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class CourseController {
  async generatePlanning(req, res) {

    const sequelizeService = await SequelizeService.get();

    try {
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating course" });
    }
  }

  buildRouter() {
    const router = Router();

    router.post("/generate", this.generatePlanning.bind(this));
    return router;
  }
}
