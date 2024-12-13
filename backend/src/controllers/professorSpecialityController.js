import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class ProfessorSpecialityController {

  // Créer une association entre un professeur et une spécialité
  async createProfessorSpeciality(req, res) {
    const { user_id, course_id } = req.body;

    if (!user_id || !course_id) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const sequelizeService = await SequelizeService.get();

    try {
      const newProfessorSpeciality = await sequelizeService.professorSpecialityService.create({
        user_id,
        course_id,
      });
      res.status(201).json(newProfessorSpeciality);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating professor-speciality association" });
    }
  }

  // Récupérer toutes les associations professeur-spécialité
  async getProfessorSpecialities(req, res) {
    const sequelizeService = await SequelizeService.get();

    try {
      const professorSpecialities = await sequelizeService.professorSpecialityService.findAll();
      res.status(200).json(professorSpecialities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error getting professor-speciality associations" });
    }
  }

  // Récupérer les spécialités d'un professeur spécifique
  async getSpecialitiesByProfessor(req, res) {
    const { professorId } = req.params;
    const sequelizeService = await SequelizeService.get();

    try {
      const professorSpecialities = await sequelizeService.professorSpecialityService.findAll({
        where: { user_id: professorId },
      });
      res.status(200).json(professorSpecialities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error getting specialities for professor" });
    }
  }

  // Construire les routes du contrôleur
  buildRouter() {
    const router = Router();

    router.post("/create", this.createProfessorSpeciality.bind(this));
    router.get("/", this.getProfessorSpecialities.bind(this));
    router.get("/:professorId", this.getSpecialitiesByProfessor.bind(this));  // Récupérer les spécialités d'un professeur par son ID

    return router;
  }
}
