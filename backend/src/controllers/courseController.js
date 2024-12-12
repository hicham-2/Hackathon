import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";

export class CourseController {
  async createCourse(req, res) {
    const { name, duration } = req.body;
    const sequelizeService = await SequelizeService.get();

    try {
      if (name && duration) {
        const courseFoundByName = await sequelizeService.courseService.findCourseByName(name);

        if (!courseFoundByName) {
          const course = await sequelizeService.courseService.createCourse({
            name,
            duration,
          });

          res.status(201).json(course);
        } else {
          res.status(409).json({ message: "Course already exists" });
        }
      } else {
        res.status(400).json({ message: "Missing data" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating course" });
    }
  }

  async getCourseById(req, res) {
    const { id } = req.params;
    const sequelizeService = await SequelizeService.get();

    try {
      const course = await sequelizeService.courseService.findCourseById(id);

      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error fetching course" });
    }
  }

  async getAllCourses(req, res) {
    const sequelizeService = await SequelizeService.get();

    try {
      const courses = await sequelizeService.courseService.findAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: "Error fetching courses" });
    }
  }

  async updateCourse(req, res) {
    const { id } = req.params;
    const { name, duration, slotId } = req.body;
    const sequelizeService = await SequelizeService.get();

    try {
      const course = await sequelizeService.courseService.findCourseById(id);

      if (course) {
        const updatedCourse = await sequelizeService.courseService.updateCourse(id, {
          name: name || course.name,
          duration: duration || course.duration,
          slotId: slotId || course.slotId,
        });

        res.status(200).json(updatedCourse);
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating course" });
    }
  }

  async deleteCourse(req, res) {
    const { id } = req.params;
    const sequelizeService = await SequelizeService.get();

    try {
      const course = await sequelizeService.courseService.findCourseById(id);

      if (course) {
        await sequelizeService.courseService.deleteCourse(id);
        res.status(204).json({ message: "Course deleted successfully" });
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting course" });
    }
  }

  buildRouter() {
    const router = Router();

    router.post("/create", this.createCourse.bind(this));
    router.get("/:id", this.getCourseById.bind(this));
    router.get("/", this.getAllCourses.bind(this));
    router.put("/:id", this.updateCourse.bind(this));
    router.delete("/:id", this.deleteCourse.bind(this));

    return router;
  }
}
