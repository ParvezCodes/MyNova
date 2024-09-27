import express from "express";
import axios from "axios";
import { Op } from "sequelize";
import Sequelize from "sequelize";
import moment from "moment";
import ComplianceMerlin from "../models/ComplianceMerlin.js";

const router = express.Router();

// MAP DB : TS
const fieldMapping = {
  stock_name: "stockName",
  isin: "isin",
  status: "status",
  ranking: "ranking",
  main_currency: "mainCurrency",
  currency: "currency",
  cba_status: "cbaStatus",
  not_halal: "notHalal",
  questionable: "questionable",
};

// Fetch all compliance data from the database
const getAllComplianceReport = async (date) => {
  try {
    const reports = await ComplianceMerlin.findAll({
      attributes: [
        "id",
        "stock_name",
        "isin",
        "status",
        "ranking",
        "main_currency",
        "currency",
        "cba_status",
        "not_halal",
        "questionable",
      ],
      where: Sequelize.where(
        Sequelize.fn("DATE", Sequelize.col("last_update_time")),
        {
          [Op.eq]: date,
        }
      ),
    });

    return { success: true, count: reports.length, data: reports };
  } catch (error) {
    return { success: false, msg: "Error fetching compliance data", error };
  }
};

// Fetch Typesense compliance report by ISIN
const getTypesenseComplianceReport = async (isin) => {
  try {
    const res = await axios.get(
      `${process.env.TS_CM_URL_PROD_SINGLE_SYMBOL}/${isin}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-TYPESENSE-API-KEY": process.env.TS_API_KEY_PROD,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      `Error fetching data for ISIN ${isin}:`,
      error.response?.data || error.message
    );
    return null; // Return null in case of error
  }
};

// Compare DB and Typesense fields
const compareReports = (dbRecord, tsRecord) => {
  const mismatches = [];

  Object.keys(fieldMapping).forEach((dbField) => {
    const tsField = fieldMapping[dbField];
    if (dbRecord[dbField] !== tsRecord[tsField]) {
      mismatches.push({
        field: dbField,
        dbValue: dbRecord[dbField],
        tsValue: tsRecord[tsField],
      });
    }
  });

  return mismatches;
};

// Route to verify compliance reports
router.post("/verify", async (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ msg: "Date is required" });
  }

  if (!moment(date, "DD-MM-YYYY", true).isValid()) {
    return res.status(400).json({ msg: "Invalid date format. Use DD-MM-YYYY" });
  }

  const formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");

  try {
    // Fetch reports from the database
    const allReports = await getAllComplianceReport(formattedDate);

    if (!allReports.success) {
      return res.status(500).json({ msg: allReports.msg });
    }

    const mismatchesArray = [];

    // Loop through each report and fetch data from Typesense for comparison
    for (const report of allReports.data) {
      const tsData = await getTypesenseComplianceReport(report.isin);

      // If Typesense data is found, compare the reports
      if (tsData) {
        const mismatches = compareReports(report, tsData);

        if (mismatches.length > 0) {
          mismatchesArray.push({
            stock_name: report.stock_name,
            isin: report.isin,
            mismatches,
          });
        }
      }
    }

    // Respond with mismatches if found
    if (mismatchesArray.length > 0) {
      res
        .status(200)
        .json({ msg: "Mismatches found",totalCount:mismatchesArray.length, mismatches: mismatchesArray });
    } else {
      res.status(200).json({ msg: "No mismatches found" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

export default router;
