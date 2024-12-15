import { Router } from "express";
import { SequelizeService } from "../services/sequelize/sequelizeService.js";
import { where } from "sequelize";
import { authMiddleware } from "../middleware/is-auth.js";
import { canAccessDashboard } from "../middleware/is-admin.js";
import { PlanningGenerator } from "../services/planningGenerator.js";

export class PlanningController {

  async generatePlanning(req, res) {
    const sequelizeService = await SequelizeService.get();

    
    if (!req.body?.classId) {
      res.status(400).json({ error: "Class ID is required" });
      return;
    }
    const courses = await sequelizeService.courseService.model.findOne({
      where: {
        id: req.body.classId,
      },
      include: {
        model: sequelizeService.sectorService.model,
        as: "sector",
        include: {
          model: sequelizeService.courseService.model,
          as: "courses",
        },
      },
    });

    const {
      sector: { courses: coursesByClasses },
    } = courses;

    const coursesIds = Array.from(coursesByClasses).map((course) => {
      return course.id;
    });

    const professors = await sequelizeService.userService.model.findAll({
      where: {
        role: "professor",
      },
      include: {
        model: sequelizeService.courseService.model,
        as: "courses",
        where: {
          id: coursesIds, // Match courses in the given array
        },
        through: {
          attributes: [], // Exclude join table attributes, optional
        },
        attributes: ["id", "name", "duration"], // Include specific course attributes, optional
      },
      attributes: ["id", "email", "firstName", "lastName"], // Include specific professor attributes, optional
    });

    const professorsAvailable =
      await sequelizeService.availabilityService.model.findAll({
        where: {
          user_id: professors.map((professor) => professor.id),
        },
        attributes: [
          "user_id",
          "start_datetime",
          "end_datetime",
          "is_available",
        ],
      });

    const coursesOnly = await sequelizeService.courseService.model.findAll({
      where: {
        id: coursesIds,
      },
      attributes: ["id", "name", "duration"],
    });

    const planningGenerator = new PlanningGenerator(
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      [
        { start: "10:00", end: "13:00" }, // Morning session
        { start: "14:00", end: "17:00" }, // First afternoon session
        { start: "17:00", end: "20:00" }, // Second afternoon session
      ],
      {
        professors: professors,
        courses: coursesOnly,
        professorsAvailable: professorsAvailable,
      }
    );

    const planning = await planningGenerator.generateSchoolSchedule()
    
    res.status(200).json(planning);

    try {
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating course" });
    }
  }

  buildRouter() {
    const router = Router();

    router.post(
      "/generate",
      authMiddleware,
      canAccessDashboard,
      this.generatePlanning.bind(this)
    );
    return router;
  }
}
