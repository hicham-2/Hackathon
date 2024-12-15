import slotModel from "../models/slotModel.js";
import { GenericQuery } from "./serviceQuery.js";

export class SlotService extends GenericQuery {
  constructor(sequelizeService) {
    super();
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Slots", slotModel);
  }

  async createSlot(slot) {
    const res = await this.model.create(slot);
    return res;
  }

  async findSlotsByDateRange(startDateTime, endDateTime) {
    const slots = await this.model.findAll({
      where: {
        startDateTime: { [this.sequelizeService.Op.gte]: startDateTime },
        endDateTime: { [this.sequelizeService.Op.lte]: endDateTime },
      },
    });

    return slots;
  }

  async updateSlotTime(slotId, startDateTime, endDateTime) {
    const slot = await this.model.update(
      { startDateTime, endDateTime },
      { where: { id: slotId } }
    );

    return slot;
  }

  async deleteSlot(slotId) {
    const result = await this.model.destroy({
      where: { id: slotId },
    });

    return result;
  }
}
