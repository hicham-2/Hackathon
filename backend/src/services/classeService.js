import classeModel from "../models/classeModel.js";

export class ClasseService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Classes", classeModel);
  }
}
