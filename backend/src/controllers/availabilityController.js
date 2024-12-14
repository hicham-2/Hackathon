import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";
import { authMiddleware } from '../middleware/is-auth.js';

export class AvailabilityController {
  async createAvailability(req, res) {
    const { start_datetime, end_datetime, is_available } = req.body;
    console.log("Données reçues :", { start_datetime, end_datetime, is_available });
  
    if (!start_datetime || !end_datetime || is_available === undefined) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }
  
    const user_id = req.user?.id;
    console.log("Utilisateur associé :", user_id);
  
    const sequelizeService = await SequelizeService.get();
  
    try {
      const availability = await sequelizeService.availabilityService.createUnavailability({
        user_id,
        start_datetime,
        end_datetime,
        is_available,
      });
  
      console.log("Disponibilité créée :", availability);
      res.status(201).json(availability);
    } catch (error) {
      console.error("Erreur lors de la création d'une disponibilité :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  }

  async getAvailabilitiesByProfessor(req, res) {
    const { professorId } = req.params;
    const sequelizeService = await SequelizeService.get();
  
    try {
      const availabilities = await sequelizeService.availabilityService.findByProfessor(professorId);
  
      const formattedAvailabilities = availabilities.map((availability) => ({
        id: availability.id,
        title: availability.is_available ? 'Disponible' : 'Occupé',
        start: availability.start_datetime,
        end: availability.end_datetime,
        backgroundColor: availability.is_available ? '#4CAF50' : '#FF5733',
      }));
  
      res.status(200).json(formattedAvailabilities);
    } catch (error) {
      console.error('Erreur lors de la récupération des disponibilités :', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
  

  async getAvailabilityById(req, res) {
    const { id } = req.params;
    const sequelizeService = await SequelizeService.get();

    try {
      const availability = await sequelizeService.findOneBy({id});

      if (!availability) {
        return res.status(404).json({ message: "Disponibilité introuvable." });
      }

      res.status(200).json(availability);
    } catch (error) {
      console.error("Erreur lors de la récupération de la disponibilité :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  }

  async updateAvailability(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const sequelizeService = await SequelizeService.get();

    try {
      const updated = await sequelizeService.availabilityService.updateUnavailability(id, updateData);

      if (updated[0] === 0) {
        return res.status(404).json({ message: "Disponibilité introuvable ou données inchangées." });
      }

      res.status(200).json({ message: "Disponibilité mise à jour avec succès." });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la disponibilité :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  }

  async deleteAvailability(req, res) {
    const { id } = req.params;
    const sequelizeService = await SequelizeService.get();

    try {
      const deleted = await sequelizeService.availabilityService.deleteUnavailability(id);

      if (!deleted) {
        return res.status(404).json({ message: "Disponibilité introuvable." });
      }

      res.status(200).json({ message: "Disponibilité supprimée avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression de la disponibilité :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  }

  buildRouter() {
    const router = Router();

    router.post("/", authMiddleware, this.createAvailability.bind(this));
    router.get("/professor/:professorId", this.getAvailabilitiesByProfessor.bind(this));
    router.get("/:id", this.getAvailabilityById.bind(this));
    router.put("/:id", this.updateAvailability.bind(this));
    router.delete("/:id", this.deleteAvailability.bind(this));

    return router;
  }
}
