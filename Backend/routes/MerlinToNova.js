import { config } from "dotenv";
config();

import { Router } from "express";
import mysql from "mysql2/promise";
import pkg from "pg";
const { Client } = pkg;
import { createPgClient } from "../DB/DB.js";

const router = Router();

const pgConfig = {
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DB,
};

const mysqlConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "nova_beta",
};

router.get("/transfer/:symbol", async (req, res) => {
  const { symbol } = req.params;
  let pgClient;
  let mysqlConnection;

  try {
    pgClient = createPgClient();
    await pgClient.connect();
    console.log("Connected to PostgreSQL.");

    console.log(`Fetching data from PostgreSQL for symbol: ${symbol}`);
    const pgRes = await pgClient.query(
      "SELECT * FROM at_company_profile WHERE ticker = $1",
      [symbol]
    );
    const rows = pgRes.rows;
    console.log(`Fetched ${rows.length} rows from PostgreSQL.`);

    mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log("Connected to MySQL.");

    for (const row of rows) {
      try {
        // Prepare the insert query
        const insertQuery = `
          INSERT INTO lambda_company_profile_3 (
            exchange_symbol, company_symbol, ticker, address, city, country,
            currency, cusip, description, employeeTotal, estimateCurrency, exchange,
            finnhubIndustry, floatingShare, fundamentalFreq, ggroup, shareOutstanding,
            marketCapCurrency, marketCapitalization, marketCapInUSD, marketCapClassification,
            gind, gsector, gsubind, ipo, irUrl, isin, lei, logo, alias, naics,
            naicsNationalIndustry, naicsSector, naicsSubsector, name, phone,
            sedol, state, usShare, weburl, status, created_date, updated_date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          row.exchange || null,
          row.ticker || null,
          row.ticker || null,
          row.address || null,
          row.city || null,
          row.country || null,
          row.currency || null,
          row.cusip || null,
          row.description || null,
          row.employee_total || null,
          row.estimate_currency || null,
          row.exchange || null,
          row.finnhub_industry || null,
          row.floating_share || null,
          row.fundamental_freq || null,
          row.ggroup || null,
          row.share_outstanding || null,
          row.currency || null,
          row.market_capitalization || null,
          row.market_capitalization * 277.27 || null,
          row.market_cap_classification || null,
          row.gind || null,
          row.gsector || null,
          row.gsubind || null,
          row.ipo || null,
          row.ir_url || null,
          row.isin || null,
          row.lei || null,
          row.logo || null,
          row.alias || null,
          row.naics || null,
          row.naics_national_industry || null,
          row.naics_sector || null,
          row.naics_subsector || null,
          row.name || null,
          row.phone || null,
          row.sedol || null,
          row.state || null,
          row.us_share || null,
          row.weburl || null,
          row.publish_un_publish === "PUBLISH" ? 1 : 0,
          row.create_date_time || null,
          row.last_update_time || null,
        ];

        // Execute the insert query
        await mysqlConnection.execute(insertQuery, values);
        console.log(
          `Inserted record with company_symbol = ${row.ticker} and exchange_symbol = ${row.exchange}`
        );
      } catch (insertError) {
        console.error(
          `Error inserting record with company_symbol = ${row.ticker} and exchange_symbol = ${row.exchange}:`,
          insertError.stack
        );
      }
    }

    console.log("Data transfer complete.");
    res.send(`Data transfer complete for symbol: ${symbol}`);
  } catch (err) {
    console.error("Error transferring data:", err.stack);
    res.status(500).send(`Error transferring data for symbol: ${symbol}`);
  } finally {
    // Close PostgreSQL connection
    if (pgClient) {
      await pgClient.end();
    }
    // Close MySQL connection
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
  }
});

export default router;
