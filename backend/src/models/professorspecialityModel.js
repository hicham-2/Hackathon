import { DataTypes } from "sequelize";

const professorspecialityModel = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, 
  }
};

export default professorspecialityModel;