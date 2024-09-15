import { DataTypes } from "sequelize";
import sequelize from "../DB/DB.js";

const CompanyProfile = sequelize.define(
  "CompanyProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    exchange_symbol: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    company_symbol: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ticker: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    cusip: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    employeeTotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estimateCurrency: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    exchange: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    finnhubIndustry: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    floatingShare: {
      type: DataTypes.DECIMAL(13, 2),
      allowNull: true,
    },
    fundamentalFreq: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    ggroup: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    shareOutstanding: {
      type: DataTypes.DECIMAL(13, 2),
      allowNull: true,
    },
    marketCapCurrency: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    marketCapitalization: {
      type: DataTypes.DECIMAL(21, 5),
      allowNull: true,
    },
    marketCapInUSD: {
      type: DataTypes.DECIMAL(21, 5),
      allowNull: true,
    },
    marketCapClassification: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    gind: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gsector: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gsubind: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    ipo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    irUrl: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    isin: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    lei: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    alias: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    naics: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    naicsNationalIndustry: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    naicsSector: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    naicsSubsector: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sedol: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    usShare: {
      type: DataTypes.DECIMAL(13, 2),
      allowNull: true,
    },
    weburl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
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
    tableName: "prod_company_profile",
    timestamps: false,
  }
);

export default CompanyProfile;
