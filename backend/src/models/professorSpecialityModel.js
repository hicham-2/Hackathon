import { DataTypes } from "sequelize";

const professorSpecialityModel = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
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
