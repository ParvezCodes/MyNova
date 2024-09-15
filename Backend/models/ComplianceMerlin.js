import { DataTypes } from "sequelize";
import sequelize from "../DB/DB.js";

const ComplianceMerlin = sequelize.define(
  "ComplianceMerlin",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    identifier: {
      type: DataTypes.TEXT,
    },
    accounts_receivable: {
      type: DataTypes.FLOAT,
    },
    cba_comment: {
      type: DataTypes.TEXT,
    },
    cba_status: {
      type: DataTypes.TEXT,
    },
    company_name: {
      type: DataTypes.TEXT,
    },
    country: {
      type: DataTypes.TEXT,
    },
    create_date_time: {
      type: DataTypes.DATE,
    },
    currency: {
      type: DataTypes.TEXT,
    },
    debt: {
      type: DataTypes.FLOAT,
    },
    debt_revenue: {
      type: DataTypes.FLOAT,
    },
    debt_status: {
      type: DataTypes.TEXT,
    },
    exchange: {
      type: DataTypes.TEXT,
    },
    financial_statement_date: {
      type: DataTypes.STRING(50),
    },
    halal: {
      type: DataTypes.FLOAT,
    },
    halal_revenue: {
      type: DataTypes.FLOAT,
    },
    impermissible_interest_income_amount_in_once: {
      type: DataTypes.FLOAT,
    },
    interest_bearing_debt_json: {
      type: DataTypes.JSON,
    },
    interest_income_json: {
      type: DataTypes.JSON,
    },
    isin: {
      type: DataTypes.TEXT,
    },
    last_update_time: {
      type: DataTypes.DATE,
    },
    local_rank: {
      type: DataTypes.INTEGER,
    },
    main_currency: {
      type: DataTypes.TEXT,
    },
    main_ticker: {
      type: DataTypes.TEXT,
    },
    not_halal: {
      type: DataTypes.FLOAT,
    },
    not_halal_revenue: {
      type: DataTypes.FLOAT,
    },
    publish_un_publish: {
      type: DataTypes.TEXT,
    },
    questionable: {
      type: DataTypes.FLOAT,
    },
    questionable_revenue: {
      type: DataTypes.FLOAT,
    },
    ranking: {
      type: DataTypes.INTEGER,
    },
    report_date: {
      type: DataTypes.STRING(50),
    },
    report_period: {
      type: DataTypes.INTEGER,
    },
    report_source: {
      type: DataTypes.TEXT,
    },
    report_type_section: {
      type: DataTypes.TEXT,
    },
    report_type_year: {
      type: DataTypes.STRING(10),
    },
    revenue_breakdown_json: {
      type: DataTypes.JSON,
    },
    revenue_breakdown_status: {
      type: DataTypes.TEXT,
    },
    screening_form_type: {
      type: DataTypes.TEXT,
    },
    securities_and_assets: {
      type: DataTypes.TEXT,
    },
    securities_and_assets_json: {
      type: DataTypes.JSON,
    },
    securities_and_assets_revenue: {
      type: DataTypes.FLOAT,
    },
    securities_and_assets_status: {
      type: DataTypes.TEXT,
    },
    share_outstanding: {
      type: DataTypes.FLOAT,
    },
    source: {
      type: DataTypes.STRING(50),
    },
    status: {
      type: DataTypes.TEXT,
    },
    stock_id: {
      type: DataTypes.TEXT,
    },
    stock_name: {
      type: DataTypes.TEXT,
    },
    total_assets: {
      type: DataTypes.FLOAT,
    },
    total_revenue: {
      type: DataTypes.FLOAT,
    },
    total_score: {
      type: DataTypes.FLOAT,
    },
    trailing36mon_avr_cap: {
      type: DataTypes.FLOAT,
    },
    units: {
      type: DataTypes.TEXT,
    },
    usd_rate: {
      type: DataTypes.FLOAT,
    },
    user_id: {
      type: DataTypes.TEXT,
    },
    username: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "compliance_merlin",
    timestamps: false, 
  }
);

export default ComplianceMerlin;
