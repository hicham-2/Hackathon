import sectorModel from "../models/sectorModel.js";

export class SectorService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Sectors", sectorModel);
  }

}