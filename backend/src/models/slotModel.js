import { DataTypes } from "sequelize";

const slotModel = {
  startDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

export default slotModel;