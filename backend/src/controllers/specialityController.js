import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class SpecialityController {

  async createSpeciality(req, res) {
    const { name } = req.body;

  if (!name  === "undefined") {
    return res.status(400).json({ message: "Invalid input data" });
  }

  const sequelizeService = await SequelizeService.get();

  try {
    

    const newSpeciality = await sequelizeService.specialityService.createSpeciality({
      name,
      
    });res.status(201).json(newSpeciality);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating speciality" });
  }
}

async getSpecialities(req, res) {
  const sequelizeService = await SequelizeService.get();

  try {
    const specialities = await sequelizeService.specialityService.getSpecialities();

    res.status(200).json(specialities);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting specialities" });
  }
}

as

  buildRouter() {
    const router = Router();

    router.post("/create", this.createSpeciality.bind(this));
    router.get("/", this.getSpecialities.bind(this));

    return router;
  }
}
