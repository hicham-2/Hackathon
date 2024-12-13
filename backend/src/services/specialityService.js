import specialityModel from "../models/specialityModel.js";

export class SpecialityService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Specialities", specialityModel);
  }

  async createSpeciality(speciality) {
    const res = await this.model.create(speciality);
    return res;
  }

  async getSpecialities() {
    const specialities = await this.model.findAll();
    return specialities;
  }
}
