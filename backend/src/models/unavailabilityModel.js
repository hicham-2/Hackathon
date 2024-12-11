import { DataTypes } from "sequelize";

const unavailabilityModel = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  professor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Professor", 
      key: "id", 
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  start_datetime: {
    type: DataTypes.DATE, 
    allowNull: false,
  },
  end_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

export default unavailabilityModel;
