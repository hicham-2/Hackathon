import { DataTypes } from "sequelize";

const specialityModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

export default specialityModel;
