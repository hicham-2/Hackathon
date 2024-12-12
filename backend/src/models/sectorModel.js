import { DataTypes } from "sequelize";

const sectorModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

export default sectorModel;
