import { config } from "dotenv";
config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.NOVA_PROD_DB,
  process.env.NOVA_PROD_USER,
  process.env.NOVA_PROD_PASS,
  {
    host: process.env.NOVA_PROD_HOST,
    dialect: "mysql",
    logging: console.log,
  }
);

export const testConnectionNovaProd = async () => {
  try {
    await sequelize.authenticate();
    console.log("NOVA_PROD Connected");
  } catch (error) {
    console.error("DB Connection Failed:", error);
  }
};

export default sequelize;
