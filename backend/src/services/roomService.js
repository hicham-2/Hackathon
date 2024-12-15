import roomModel from "../models/roomModel.js";
import { GenericQuery } from "./serviceQuery.js";

export class RoomService extends GenericQuery{
  constructor(sequelizeService) {
        super(); 
this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Rooms", roomModel);
  }

  async createRoom(room) {
    const res = await this.model.create(room);
    return res;
  }

  async getRooms() {
    const rooms = await this.model.findAll();
    return rooms;
  }

  async findRoomById(id) {
    try {
      return await this.model.findByPk(id);
    } catch (error) {
      console.error("Erreur lors de la récupération de la salle :", error);
      throw error;
    }
  }

  async deleteRoom(id) {
    const res = await this.model.destroy({
      where: { id: id },
    });

    return res;
  }

  async findRoomByName(name) {
    const room = await this.model.findOne({
      where: { name: name },
    });

    return room;
  }

  async findAvailableRooms() {
    const rooms = await this.model.findAll({
      where: { is_available: true },
    });

    return rooms;
  }

  async findRooms() {
    const rooms = await this.model.findAll();
    return rooms;
  }
  
  async updateRoomAvailability(roomId, availability) {
    const room = await this.model.update(
      { is_available: availability },
      { where: { id: roomId } }
    );

    return room;
  }

  async findRoomsByCapacity(capacity) {
    const rooms = await this.model.findAll({
      where: { capacity: { [this.sequelizeService.Op.gte]: capacity } },
    });

    return rooms;
  }
}
