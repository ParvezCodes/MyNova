import { config } from "dotenv";
config();

import { Sequelize } from "sequelize";
import pkg from "pg";
const { Client } = pkg;

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

export function createPgClient() {
  const client = new Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DB,
  });

  return client;
}

export default sequelize;
