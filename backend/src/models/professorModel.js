import { DataTypes } from "sequelize";

const professorModel = {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: 'id', 
       
    },
    allowNull: false,
  },

};

export default professorModel;