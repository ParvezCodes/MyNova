import { DataTypes } from "sequelize";
import sequelize from "../DB/DB.js";

const ForTypesenseUpdate = sequelize.define(
  "TypesenseUpdateCM",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    main_stock_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    main_isin: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    main_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    secondary_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    status_mismatch: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "for_typesense_update",
    timestamps: false,
    underscored: true,
  }
);

export default ForTypesenseUpdate; // Export the correct model
