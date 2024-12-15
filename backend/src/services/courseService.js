import courseModel from "../models/courseModel.js";
import { GenericQuery } from "./serviceQuery.js";

export class CourseService extends GenericQuery{
  constructor(sequelizeService) {
        super(); 
this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Courses", courseModel);
  }

  async createCourse(course) {
    const res = await this.model.create(course);
    return res;
  }

  async findCourseByName(name) {
    const course = await this.model.findOne({
      where: { name: name },
    });

    return course;
  }

  async findCourseById(id) {
    const course = await this.model.findByPk(id); 
    return course;
  }

  async findAllCourses() {
    const courses = await this.model.findAll();
    return courses;
  }

  async updateCourse(courseId, updatedFields) {
    const result = await this.model.update(updatedFields, {
      where: { id: courseId },
      returning: true,
    });

    return result[1][0]; 
  }

  async deleteCourse(courseId) {
    const result = await this.model.destroy({
      where: { id: courseId },
    });

    return result;
  }
}
