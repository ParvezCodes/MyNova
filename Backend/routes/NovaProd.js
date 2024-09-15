import express from "express";
import CompanyProfile from "../models/CompanyProfile.js";
import LambdaCompanyProfile from "../models/LambdaCompanyProfile.js";

const router = express.Router();

router.get("/pcplcp", async (req, res) => {
  try {
    // Fetch all records from both tables
    const [lambdaRecords, prodRecords] = await Promise.all([
      LambdaCompanyProfile.findAll({
        attributes: [
          "company_symbol",
          "name",
          "isin",
          "cusip",
          "currency",
          "logo",
        ],
      }),
      CompanyProfile.findAll({
        attributes: [
          "company_symbol",
          "name",
          "isin",
          "cusip",
          "currency",
          "logo",
        ],
      }),
    ]);

    // Find mismatched records
    const mismatchedRecords = [];

    // Convert prodRecords array to a lookup object for easy comparison
    const prodLookup = prodRecords.reduce((acc, record) => {
      acc[record.company_symbol] = record;
      return acc;
    }, {});

    lambdaRecords.forEach((lambdaRecord) => {
      const prodRecord = prodLookup[lambdaRecord.company_symbol];

      if (prodRecord) {
        const mismatches = {};

        // Check each field and record mismatches
        if (lambdaRecord.name !== prodRecord.name) {
          mismatches.name = {
            lambda: lambdaRecord.name,
            prod: prodRecord.name,
          };
        }
        if (lambdaRecord.isin !== prodRecord.isin) {
          mismatches.isin = {
            lambda: lambdaRecord.isin,
            prod: prodRecord.isin,
          };
        }
        if (lambdaRecord.cusip !== prodRecord.cusip) {
          mismatches.cusip = {
            lambda: lambdaRecord.cusip,
            prod: prodRecord.cusip,
          };
        }
        if (lambdaRecord.currency !== prodRecord.currency) {
          mismatches.currency = {
            lambda: lambdaRecord.currency,
            prod: prodRecord.currency,
          };
        }

        // Add record to mismatchedRecords if there are mismatches
        if (Object.keys(mismatches).length > 0) {
          mismatchedRecords.push({
            company_symbol: lambdaRecord.company_symbol,
            mismatches,
            logo: lambdaRecord.logo,
          });
        }
      }
    });

    // Debugging output
    console.log("Mismatched Records:", mismatchedRecords);

    res.json(mismatchedRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
