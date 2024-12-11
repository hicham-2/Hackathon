import { DataTypes } from "sequelize";

const professorModel = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',  
    },
    allowNull: false,
  },
  specialty_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'professorspeciality',
      key: 'id',             
    },
    allowNull: false,
  },
};

export default professorModel;