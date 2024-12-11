import courseModel from "../models/courseModel.js";

export class CourseService {
  constructor(sequelizeService) {
    this.sequelizeService = sequelizeService.sequelize;

    this.model = this.sequelizeService.define("Course", courseModel);
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

  async findAllCourses() {
    const courses = await this.model.findAll();
    return courses;
  }

  async updateCourseDuration(courseId, duration) {
    const course = await this.model.update(
      { duration: duration },
      { where: { id: courseId } }
    );

    return course;
  }

  async deleteCourse(courseId) {
    const result = await this.model.destroy({
      where: { id: courseId },
    });

    return result;
  }
}
