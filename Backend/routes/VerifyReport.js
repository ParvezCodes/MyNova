import express from "express";
import axios from "axios";
import { Op } from "sequelize";
import Sequelize from "sequelize";
import moment from "moment";
import ProdComplianceMerlin from "../models/ProdComplianceMerlin.js";

const router = express.Router();

// MAP DB : TS
const fieldMapping = {
  main_ticker: "stockName",
  isin: "isin",
  status: "status",
  ranking: "ranking",
  main_currency: "mainCurrency",
  currency: "currency",
  cba_status: "cbaStatus",
  not_halal: "notHalal",
  not_halal_revenue: "notHalalRevenue",
  questionable: "questionable",
  questionable_revenue: "questionableRevenue",
};

// Fetch all compliance data from the database
const getAllComplianceReport = async (date) => {
  try {
    const reports = await ProdComplianceMerlin.findAll({
      attributes: [
        "id",
        "main_ticker",
        "stock_name",
        "isin",
        "status",
        "ranking",
        "main_currency",
        "currency",
        "cba_status",
        "not_halal",
        "not_halal_revenue",
        "questionable",
        "questionable_revenue",
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

const compareReports = (dbRecord, tsRecord) => {
  const mismatches = [];

  Object.keys(fieldMapping).forEach((dbField) => {
    const tsField = fieldMapping[dbField];

    // If the field is 'not_halal_revenue' or 'questionable_revenue', compare without decimals
    if (dbField === "not_halal_revenue" || dbField === "questionable_revenue") {
      const dbValue = Math.round(parseFloat(dbRecord[dbField])); // Remove decimals from DB value
      const tsValue = Math.round(parseFloat(tsRecord[tsField])); // Remove decimals from TS value

      if (dbValue !== tsValue) {
        mismatches.push({
          field: dbField,
          dbValue: dbValue,
          tsValue: tsValue,
        });
      }
    } else if (dbRecord[dbField] !== tsRecord[tsField]) {
      // Regular comparison for other fields
      mismatches.push({
        field: dbField,
        dbValue: dbRecord[dbField],
        tsValue: tsRecord[tsField],
      });
    }
  });

  return mismatches;
};

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
    let notFoundInTypesenseCount = 0;
    let noTickerMatchCount = 0; // Count for records where no match is found in subTickersInfo

    // Loop through each report and fetch data from Typesense for comparison
    for (const report of allReports.data) {
      const tsData = await getTypesenseComplianceReport(report.isin);

      if (!tsData) {
        notFoundInTypesenseCount++;
        continue; // Skip to the next record if no Typesense data found
      }

      // Check if db.main_ticker and db.stock_name match in subTickersInfo
      const tickerMatch = tsData.subTickersInfo?.some(
        (subticker) =>
          subticker.mainTicker === report.main_ticker &&
          subticker.subTicker === report.stock_name
      );

      // If no match is found in subTickersInfo, skip this report
      if (!tickerMatch) {
        noTickerMatchCount++;
        continue;
      }

      // Proceed with comparison if both stock_name and main_ticker match
      const mismatches = compareReports(report, tsData);

      if (mismatches.length > 0) {
        mismatchesArray.push({
          stock_name: report.stock_name,
          main_ticker: report.main_ticker,
          isin: report.isin,
          mismatches,
        });
      }
    }

    res.status(200).json({
      msg:
        mismatchesArray.length > 0 ? "Mismatches found" : "No mismatches found",
      totalCount: mismatchesArray.length,
      mismatches: mismatchesArray,
      notFoundInTypesenseCount, // Return count of ISINs not found in Typesense
      noTickerMatchCount, // Return count of records where no main_ticker and sub_ticker match was found
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// ======================================================================================================================================================

// // MAP DB : TS
// const fieldMapping = {
//   main_ticker: "stockName",
//   isin: "isin",
//   status: "status",
//   ranking: "ranking",
//   main_currency: "mainCurrency",
//   currency: "currency",
//   cba_status: "cbaStatus",
//   not_halal: "notHalal",
//   not_halal_revenue: "notHalalRevenue",
//   questionable: "questionable",
//   questionable_revenue: "questionableRevenue",
// };

// // Fetch all compliance data from the database
// const getAllComplianceReport = async (date) => {
//   try {
//     const reports = await ProdComplianceMerlin.findAll({
//       attributes: [
//         "id",
//         "main_ticker",
//         "stock_name",
//         "isin",
//         "status",
//         "ranking",
//         "main_currency",
//         "currency",
//         "cba_status",
//         "not_halal",
//         "not_halal_revenue",
//         "questionable",
//         "questionable_revenue",
//       ],
//       where: Sequelize.where(
//         Sequelize.fn("DATE", Sequelize.col("last_update_time")),
//         {
//           [Op.eq]: date,
//         }
//       ),
//     });

//     return { success: true, count: reports.length, data: reports };
//   } catch (error) {
//     return { success: false, msg: "Error fetching compliance data", error };
//   }
// };

// // Fetch Typesense compliance report by ISIN
// const getTypesenseComplianceReport = async (isin) => {
//   try {
//     const res = await axios.get(
//       `${process.env.TS_CM_URL_PROD_SINGLE_SYMBOL}/${isin}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-TYPESENSE-API-KEY": process.env.TS_API_KEY_PROD,
//         },
//       }
//     );
//     return res.data;
//   } catch (error) {
//     console.error(
//       `Error fetching data for ISIN ${isin}:`,
//       error.response?.data || error.message
//     );
//     return null; // Return null in case of error
//   }
// };

// const compareReports = (dbRecord, tsRecord) => {
//   const mismatches = [];

//   Object.keys(fieldMapping).forEach((dbField) => {
//     const tsField = fieldMapping[dbField];

//     // Direct comparison for revenue fields (no rounding, no parsing)
//     if (dbField === "not_halal_revenue" || dbField === "questionable_revenue") {
//       const dbValue = dbRecord[dbField]; // No conversion, use as is
//       const tsValue = tsRecord[tsField]; // No conversion, use as is

//       if (dbValue !== tsValue) {
//         mismatches.push({
//           field: dbField,
//           dbValue: dbValue,
//           tsValue: tsValue,
//         });
//       }
//     } else if (dbRecord[dbField] !== tsRecord[tsField]) {
//       // Regular comparison for other fields
//       mismatches.push({
//         field: dbField,
//         dbValue: dbRecord[dbField],
//         tsValue: tsRecord[tsField],
//       });
//     }
//   });

//   return mismatches;
// };

// router.post("/verify", async (req, res) => {
//   const { date } = req.body;

//   if (!date) {
//     return res.status(400).json({ msg: "Date is required" });
//   }

//   if (!moment(date, "DD-MM-YYYY", true).isValid()) {
//     return res.status(400).json({ msg: "Invalid date format. Use DD-MM-YYYY" });
//   }

//   const formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");

//   try {
//     const allReports = await getAllComplianceReport(formattedDate);

//     if (!allReports.success) {
//       return res.status(500).json({ msg: allReports.msg });
//     }

//     const mismatchesArray = [];
//     let notFoundInTypesenseCount = 0;

//     // Loop each report and fetch data from Typesense
//     for (const report of allReports.data) {
//       const tsData = await getTypesenseComplianceReport(report.isin);

//       if (!tsData) {
//         notFoundInTypesenseCount++;
//         continue;
//       }

//       // Check if stock_name exists in Typesense subTickersInfo array
//       const stockExistsInSubTickers = tsData.subTickersInfo?.find(
//         (subticker) => subticker.subTicker === report.stock_name
//       );

//       if (!stockExistsInSubTickers) {
//         notFoundInTypesenseCount++;
//         continue;
//       }

//       const mismatches = compareReports(report, tsData);

//       if (mismatches.length > 0) {
//         mismatchesArray.push({
//           stock_name: report.stock_name,
//           isin: report.isin,
//           mismatches,
//         });
//       }
//     }

//     res.status(200).json({
//       msg:
//         mismatchesArray.length > 0 ? "Mismatches found" : "No mismatches found",
//       totalCount: mismatchesArray.length,
//       mismatches: mismatchesArray,
//       notFoundInTypesenseCount,
//     });
//   } catch (error) {
//     res.status(500).json({ msg: "Internal Server Error", error });
//   }
// });

// ============================================================ WORK IN PROGRESS ============================================================
// const getComplianceDataByMainTicker = async (mainTicker) => {
//   try {
//     const response = await axios.get(
//       `https://api.nova.musaffa.com/api/get_compliance_data_by_mainticker?symbol=${mainTicker}`
//     );

//     const extractedData = {
//       mainTicker: response.data.stockName,
//       isin: response.data.isin,
//       status: response.data.status,
//       ranking: response.data.ranking,
//       mainCurrency: response.data.mainCurrency,
//       cbaStatus: response.data.cbaStatus,
//       notHalal: response.data.notHalal,
//       notHalalRevenue: response.data.notHalalRevenue,
//       questionable: response.data.questionable,
//       questionableRevenue: response.data.questionableRevenue,
//     };

//     return { success: true, data: extractedData };
//   } catch (error) {
//     console.error(
//       `Error fetching data for mainTicker ${mainTicker}:`,
//       error.message
//     );
//     return {
//       success: false,
//       msg: `Error fetching data for ${mainTicker}`,
//       error,
//     };
//   }
// };

// const getAllDBComplianceReport = async (date) => {
//   try {
//     const reports = await ProdComplianceMerlin.findAll({
//       attributes: ["id", "main_ticker", "stock_name", "isin"],
//       where: Sequelize.where(
//         Sequelize.fn("DATE", Sequelize.col("last_update_time")),
//         {
//           [Op.eq]: date,
//         }
//       ),
//     });

//     return { success: true, count: reports.length, data: reports };
//   } catch (error) {
//     return { success: false, msg: "Error fetching compliance data", error };
//   }
// };

// router.post("/verify2", async (req, res) => {
//   const { date } = req.body;

//   if (!date) {
//     return res.status(400).json({ msg: "Date is required" });
//   }

//   if (!moment(date, "DD-MM-YYYY", true).isValid()) {
//     return res.status(400).json({ msg: "Invalid date format. Use DD-MM-YYYY" });
//   }

//   const formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");

//   try {
//     const allReports = await getAllDBComplianceReport(formattedDate);
//     if (!allReports.success) {
//       return res
//         .status(500)
//         .json({ msg: "Error fetching reports from the database" });
//     }

//     const fetchResults = [];

//     for (const report of allReports.data) {
//       const mainTicker = report.main_ticker;

//       // Fetch compliance data from Nova API for this main_ticker
//       const novaResponse = await getComplianceDataByMainTicker(mainTicker);

//       fetchResults.push({
//         main_ticker: mainTicker,
//         nova_data: novaResponse.success ? novaResponse.data : novaResponse.msg,
//       });
//     }
//     res.status(200).json({
//       success: true,
//       totalReports: fetchResults.length,
//       data: fetchResults,
//     });
//   } catch (error) {
//     res.status(500).json({ msg: "Internal Server Error", error });
//   }
// });

export default router;
