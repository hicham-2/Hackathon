import sectorModel from "../models/sectorModel.js";
import { GenericQuery } from "./serviceQuery.js";

export class SectorService extends GenericQuery {
  constructor(sequelizeService) {
    super();
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Sectors", sectorModel);
  }

  async createSector(sector) {
    const res = await this.model.create(sector);

    return res;
  }

  async findSectorByName(name) {
    const sector = await this.model.findOne({
      where: { name: name },
    });

    return sector;
  }

  async findAllSectors() {
    const sectors = await this.model.findAll();

    return sectors;
  }

  async updateSectorName(sectorId, newName) {
    const sector = await this.model.update(
      { name: newName },
      { where: { id: sectorId } }
    );

    return sector;
  }

  async deleteSectorById(sectorId) {
    const result = await this.model.destroy({
      where: { id: sectorId },
    });

    return result;
  }
}
