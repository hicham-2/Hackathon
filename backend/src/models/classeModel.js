import { DataTypes } from "sequelize";

const classeModel = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sector_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Sectors",
      key: "id",
    },
    onDelete: "CASCADE",
  },
};

export default classeModel;
