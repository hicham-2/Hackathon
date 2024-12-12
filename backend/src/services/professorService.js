import professorModel from "../models/professorModel.js"; // Importer le modèle Professor

export class ProfessorService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Professors", professorModel);
  }

  async createProfessor(professor) {
    const res = await this.model.create(professor);
    return res;
  }

  async findProfessorById(id) {
    const professor = await this.model.findOne({
      where: { id: id },
    });

    return professor;
  }

  async findProfessorByUserId(userId) {
    const professor = await this.model.findOne({
      where: { user_id: userId },
    });

    return professor;
  }

  async findAllProfessors() {
    const professors = await this.model.findAll();
    return professors;
  }
}
