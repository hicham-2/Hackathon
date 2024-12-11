import professorSpecialityModel from "../models/professorSpecialityModel.js"; // Importer le modèle de la table de jonction

export class ProfessorSpecialityService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    // Définir le modèle ProfessorSpeciality dans Sequelize
    this.model = this.sequelizeService.define("ProfessorSpeciality", professorSpecialityModel,  { tableName: "ProfessorSpeciality" });
  }

  async createProfessorSpeciality(professorId, specialityId) {
    const professorSpeciality = await this.model.create({
      professor_id: professorId,
      speciality_id: specialityId,
    });
    return professorSpeciality;
  }

  async findProfessorSpeciality(professorId, specialityId) {
    const relation = await this.model.findOne({
      where: {
        professor_id: professorId,
        speciality_id: specialityId,
      },
    });
    return relation;
  }

  
  async findAllProfessorSpecialities() {
    const relations = await this.model.findAll();
    return relations;
  }


  async findSpecialitiesByProfessor(professorId) {
    const relations = await this.model.findAll({
      where: { professor_id: professorId },
    });
    return relations;
  }

  async findProfessorsBySpeciality(specialityId) {
    const relations = await this.model.findAll({
      where: { speciality_id: specialityId },
    });
    return relations;
  }
}
