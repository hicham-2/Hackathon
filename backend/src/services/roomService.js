import roomModel from "../models/roomModel.js";

export class RoomService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Room", roomModel);
  }

  async createRoom(room) {
    const res = await this.model.create(room);
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
      where: { isAvailable: true },
    });

    return rooms;
  }

  async updateRoomAvailability(roomId, availability) {
    const room = await this.model.update(
      { isAvailable: availability },
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