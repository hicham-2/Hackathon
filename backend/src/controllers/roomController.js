import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class RoomController {
  // Créer une salle
  async createRoom(req, res) {
    const { name, capacity, is_available } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Le champ 'name' est requis." });
    }
    if (!capacity) {
      return res.status(400).json({ message: "Le champ 'capacity' est requis." });
    }
    if (typeof is_available === "undefined") {
      return res.status(400).json({ message: "Le champ 'is_available' est requis." });
    }

    const sequelizeService = await SequelizeService.get();

    try {
      const roomFoundByName = await sequelizeService.roomService.findRoomByName(name);

      if (roomFoundByName) {
        return res.status(400).json({ message: "La salle existe déjà." });
      }

      const newRoom = await sequelizeService.roomService.createRoom({
        name,
        capacity,
        is_available,
      });

      res.status(201).json(newRoom);
    } catch (error) {
      console.error("Erreur lors de la création de la salle :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  }

  // Récupérer toutes les salles
  async getRooms(req, res) {
    const sequelizeService = await SequelizeService.get();

    try {
      const rooms = await sequelizeService.roomService.getRooms();
      res.status(200).json(rooms);
    } catch (error) {
      console.error("Erreur lors de la récupération des salles :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  }

  //Supprimer une salle
  async deleteRoom(req, res) {
    const { id } = req.params;
  
    if (!id) {
      console.log("Aucun ID fourni dans la requête.");
      return res.status(400).json({ message: "L'identifiant de la salle est requis." });
    }
  
    const sequelizeService = await SequelizeService.get();
  
    try {
      console.log(`Recherche de la salle avec l'ID : ${id}`);
      const roomFound = await sequelizeService.roomService.findRoomById(id);
  
      if (!roomFound) {
        console.log("Salle introuvable.");
        return res.status(404).json({ message: "La salle n'existe pas." });
      }
  
      console.log(`Salle trouvée : ${JSON.stringify(roomFound)}`);
      const result = await sequelizeService.roomService.deleteRoom(id);
  
      if (result === 1) {
        console.log("Salle supprimée avec succès.");
        res.status(200).json({ message: "La salle a été supprimée." });
      } else {
        console.log("Erreur inconnue lors de la suppression.");
        res.status(500).json({ message: "Erreur inconnue lors de la suppression." });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la salle :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  }
  
//Afficher une salle par id
  async getRoomById(req, res) {
    const { id } = req.params;
  
    if (!id) {
      console.log("Aucun ID fourni dans la requête.");
      return res.status(400).json({ message: "L'identifiant de la salle est requis." });
    }
  
    const sequelizeService = await SequelizeService.get();
  
    try {
      console.log(`Recherche de la salle avec l'ID : ${id}`);
      const roomFound = await sequelizeService.roomService.findRoomById(id);
  
      if (!roomFound) {
        console.log("Salle introuvable.");
        return res.status(404).json({ message: "La salle n'existe pas." });
      }
  
      console.log(`Salle trouvée : ${JSON.stringify(roomFound)}`);
      res.status(200).json(roomFound);
    } catch (error) {
      console.error("Erreur lors de la récupération de la salle :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  }


  // Construire les routes
  buildRouter() {
    const router = Router();

    router.post("/create", this.createRoom.bind(this));
    router.get("/", this.getRooms.bind(this));
    router.get("/:id", this.getRoomById.bind(this));
    router.delete("/:id", this.deleteRoom.bind(this));

    return router;
  }
}
