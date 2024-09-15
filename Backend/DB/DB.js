import { config } from "dotenv";
config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "mysql",
    logging: console.log,
  }
);

// console.log("HOST : ", process.env.HOST);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("NOVA Connected");
  } catch (error) {
    console.error("DB Connection Failed:", error);
  }
};

export default sequelize;
