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
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Rooms",
      key: "id",
    },
  },
};

export default slotModel;