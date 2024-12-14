import professorSpecialityModel from "../models/professorSpecialityModel.js"; // Importer le modèle de la table de jonction
import { GenericQuery } from "./serviceQuery.js";

export class ProfessorSpecialityService extends GenericQuery{
  constructor(sequelizeService) {
        super(); 
this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("ProfessorSpeciality", professorSpecialityModel,  { tableName: "ProfessorSpeciality" });
  }

  async createProfessorSpeciality(user_id, course_id) {
    const professorSpeciality = await this.model.create({
      user_id: user_id,
      course_id: course_id,
    });
    return professorSpeciality;
  }

  async findProfessorSpeciality(user_id, course_id) {
    const relation = await this.model.findOne({
      where: {
        user_id: user_id,
        course_id: course_id,
      },
    });
    return relation;
  }

  
  async findAllProfessorSpecialities() {
    const relations = await this.model.findAll();
    return relations;
  }


  async findSpecialitiesByProfessor(user_id) {
    const relations = await this.model.findAll({
      where: { user_id: user_id },
    });
    return relations;
  }

  async findProfessorsBySpeciality(course_id) {
    const relations = await this.model.findAll({
      where: { course_id: course_id },
    });
    return relations;
  }
  async updateProfessorSpeciality(id, data) {
    const speciality = await this.model.findByPk(id);

    if (speciality) {

      return await speciality.update(data);
    }

    throw new Error("Professor speciality not found");
  }


  async deleteProfessorSpeciality(id) {
    const speciality = await this.model.findByPk(id);

    if (speciality) {
      return await speciality.destroy();
    }

    throw new Error("Professor speciality not found");
  }

}


