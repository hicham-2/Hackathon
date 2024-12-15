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

  sector_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Sectors",
      key: "id",
    },
  },
};

export default courseModel;
