import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class RoomController {
  async createRoom(req, res) {
    const { name, capacity, isAvailable } = req.body;
    const sequelizeService = await SequelizeService.get();

    try {
      if (name) {
        const roomFoundByName = await sequelizeService.roomService.findRoomByName(name);

        if (!roomFoundByName) {
          const newRoom = await sequelizeService.roomService.createRoom({
            name,
            capacity,
            isAvailable,
          });

          res.status(201).json(newRoom);
        }
      } else {
        res.status(400).json({ message: "classe déja existante" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating room" });
    }
  }

  async getAllRooms(req, res) {
    const sequelizeService = await SequelizeService.get();

    try {
      const rooms = await sequelizeService.roomService.findRooms();
      res.status(200).json(rooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de la récupération des salles" });
    }
  }

  buildRouter() {
    const router = Router();

    router.post("/create", this.createRoom.bind(this));
    router.get("/", this.getAllRooms.bind(this));
    return router;
  }
}
