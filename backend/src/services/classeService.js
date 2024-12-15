import classeModel from "../models/classeModel.js";
import { GenericQuery } from "./serviceQuery.js";

export class ClasseService extends GenericQuery{
  constructor(sequelizeService) {
        super(); 
this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Classes", classeModel);
  }
}
