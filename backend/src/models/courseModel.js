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
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Rooms",
      key: "id",
    },
  },
};

export default courseModel;
