import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class ProfessorSpecialityController {

  async createProfessorSpeciality(req, res) {
    const { user_id, course_id } = req.body;
    const sequelizeService = await SequelizeService.get();

    try {
      if (user_id && course_id) {
        const newProfessorSpeciality = await sequelizeService.professorSpecialityService.createProfessorSpeciality(user_id, course_id);
        res.status(201).json(newProfessorSpeciality);
      } else {
        res.status(400).json({ message: "Missing data" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating professor speciality" });
    }
  }

  async getProfessorSpecialityById(req, res) {
    const { user_id, course_id } = req.params;
    const sequelizeService = await SequelizeService.get();

    try {
    const speciality = await sequelizeService.professorSpecialityService.findProfessorSpeciality(user_id, course_id);

      if (speciality) {
        res.status(200).json(speciality);
      } else {
        res.status(404).json({ message: "Professor speciality not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching professor speciality" });
    }
  }


  async getAllProfessorSpecialities(req, res) {
    const sequelizeService = await SequelizeService.get();

    try {
      const specialities = await sequelizeService.professorSpecialityService.findAllProfessorSpecialities();
      res.status(200).json(specialities);
    } catch (error) {
      res.status(500).json({ error: "Error fetching professor specialities" });
    }
  }

  async updateProfessorSpeciality(req, res) {
    const { id } = req.params;
    const { user_id, course_id } = req.body;
    const sequelizeService = await SequelizeService.get();

    try {
      const updatedSpeciality = await sequelizeService.professorSpecialityService.updateProfessorSpeciality(id, {
        user_id: user_id || undefined,
        course_id: course_id || undefined,
      });
      res.status(200).json(updatedSpeciality);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteProfessorSpeciality(req, res) {
    const { id } = req.params;
    const sequelizeService = await SequelizeService.get();

    try {
      await sequelizeService.professorSpecialityService.deleteProfessorSpeciality(id);
      res.status(204).json({ message: "Professor speciality deleted successfully" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  buildRouter() {
    const router = Router();

    router.post("/create", this.createProfessorSpeciality.bind(this));
    router.get("/:id", this.getProfessorSpecialityById.bind(this));
    router.get("/", this.getAllProfessorSpecialities.bind(this));
    router.put("/:id", this.updateProfessorSpeciality.bind(this));
    router.delete("/:id", this.deleteProfessorSpeciality.bind(this));

    return router;
  }
}
