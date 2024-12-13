import { DataTypes } from "sequelize";

const roomModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
};

export default roomModel;
