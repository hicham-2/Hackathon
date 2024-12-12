import { DataTypes } from "sequelize";
import professorModel from "./professorModel.js";
import courseModel from "./courseModel.js";

const professorSpecialityModel = {
  professor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Professor',
      key: "id",
    },
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Course",
      key: "id",
    },
  },
};

export default professorSpecialityModel;
