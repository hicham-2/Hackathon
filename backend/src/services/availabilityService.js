import availabilityModel from "../models/availabilityModel.js";

export class AvailabilityService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define(
      "Availabilities",
      availabilityModel
    );
  }

  async createUnavailability(unavailability) {
    const res = await this.model.create(unavailability);
    return res;
  }

  async findByProfessor(professorId) {
    const unavailabilities = await this.model.findAll({
      where: { user_id: professorId },
    });

    return unavailabilities;
  }

  async findById(id) {
    const unavailability = await this.model.findOne({
      where: { id },
    });

    return unavailability;
  }

  async updateUnavailability(id, updateData) {
    const res = await this.model.update(updateData, {
      where: { id },
    });

    return res;
  }

  async deleteUnavailability(id) {
    const res = await this.model.destroy({
      where: { id },
    });

    return res;
  }
}
