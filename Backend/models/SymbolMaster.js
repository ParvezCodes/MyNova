import { DataTypes } from "sequelize";
import sequelize from "../DB/DB.js";

const SymbolMaster = sequelize.define(
  "SymbolMaster",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    exchange_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    mic: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    symbol2: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    displaySymbol: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    figi: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    shareClassFIGI: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isin: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "lambda_symbol_master",
    timestamps: false,
  }
);

export default SymbolMaster;
