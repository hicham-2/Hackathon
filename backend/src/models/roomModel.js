import { DataTypes } from "sequelize";

const roomModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
};

export default roomModel;
