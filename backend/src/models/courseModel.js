import { DataTypes } from "sequelize";

const courseModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

export default courseModel;
