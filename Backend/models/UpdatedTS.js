import { DataTypes } from "sequelize";
import sequelize from "../DB/DB.js";

const UpdatedTypesense = sequelize.define(
  "UpdatedTypesense",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    typesense_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isin: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    stock_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "for_updated_typesense",
    timestamps: false,
    underscored: true,
  }
);

export default UpdatedTypesense;
