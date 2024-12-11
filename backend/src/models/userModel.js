import { DataTypes } from "sequelize";

const userModel = {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
  },
};

export default userModel;
