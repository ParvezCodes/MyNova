import express from "express";
import axios from "axios";

const router = express.Router();

// async function compareApiWithTypesense() {
//   try {
//     // Fetch data from all sources
//     const [typeSenseRecords, apiData] = await Promise.all([
//       typesense_company_profile_collection(),
//       fetchDataFromAPI(),
//     ]);

//     // Map API data for faster lookups
//     const apiDataMap = apiData.reduce((map, item) => {
//       map[item.stock_name] = {
//         new_isin: item.new_isin,
//         status: item.status,
//       };
//       return map;
//     }, {});

//     // Arrays to store mismatches
//     const mismatchedISINs = [];
//     const mismatchedStatuses = [];

//     // Compare data
//     typeSenseRecords.forEach((record) => {
//       const apiRecord = apiDataMap[record.id];

//       // If an API record exists for the given Typesense record
//       if (apiRecord) {
//         // Compare ISINs
//         if (apiRecord.new_isin && apiRecord.new_isin !== record.typeSenseIsin) {
//           mismatchedISINs.push({
//             company_Symbol: record.id,
//             typeSenseId: record.id,
//             apiNewIsin: apiRecord.new_isin,
//             typeSenseISIN: record.typeSenseIsin,
//           });
//         }

//         // Compare Shariah compliance statuses
//         if (
//           apiRecord.status &&
//           apiRecord.status !== record.typeSenseShariahCompliantStatus
//         ) {
//           mismatchedStatuses.push({
//             company_Symbol: record.id,
//             typeSenseId: record.id,
//             apiStatus: apiRecord.status,
//             typeSenseStatus: record.typeSenseShariahCompliantStatus,
//           });
//         }
//       }
//     });

//     return {
//       ISINcount: mismatchedISINs.length,
//       StatusCount: mismatchedStatuses.length,
//       mismatchedISINs,
//       mismatchedStatuses,
//     };
//   } catch (error) {
//     console.error("Error comparing API with Typesense:", error.message);
//     throw new Error("Failed to compare API with Typesense");
//   }
// }

// WITHOUT DUBLICATE LOGIC
// async function compareApiWithTypesense() {
//   try {
//     // Fetch data from all sources
//     const [typeSenseRecords, apiData] = await Promise.all([
//       typesense_company_profile_collection(),
//       fetchDataFromAPI(),
//     ]);

//     // Arrays to store mismatches
//     const mismatchedISINs = [];
//     const mismatchedStatuses = [];

//     // Compare data
//     typeSenseRecords.forEach((record) => {
//       // Find the corresponding API record by matching stock_name with the Typesense id
//       const apiRecord = apiData.find((item) => item.stock_name === record.id);

//       // If an API record exists for the given Typesense record
//       if (apiRecord) {
//         // Compare ISINs with trimming
//         if (
//           apiRecord.new_isin &&
//           apiRecord.new_isin.trim() !== record.typeSenseIsin.trim()
//         ) {
//           mismatchedISINs.push({
//             company_Symbol: record.id,
//             typeSenseId: record.id,
//             apiNewIsin: apiRecord.new_isin,
//             typeSenseISIN: record.typeSenseIsin,
//           });
//         }

//         // Compare Shariah compliance statuses with trimming
//         if (
//           apiRecord.status &&
//           apiRecord.status.trim() !==
//             record.typeSenseShariahCompliantStatus.trim()
//         ) {
//           mismatchedStatuses.push({
//             company_Symbol: record.id,
//             typeSenseId: record.id,
//             apiStatus: apiRecord.status,
//             typeSenseStatus: record.typeSenseShariahCompliantStatus,
//           });
//         }
//       }
//     });

//     return {
//       ISINcount: mismatchedISINs.length,
//       StatusCount: mismatchedStatuses.length,
//       mismatchedISINs,
//       mismatchedStatuses,
//     };
//   } catch (error) {
//     console.error("Error comparing API with Typesense:", error.message);
//     throw new Error("Failed to compare API with Typesense");
//   }
// }

// DUBLICATE SYMBOL LOGIN
async function compareApiWithTypesense() {
  try {
    console.log("Comaparing Api and typesense data");
    // Fetch data from all sources
    const [typeSenseRecords, apiData] = await Promise.all([
      typesense_company_profile_collection(),
      fetchDataFromAPI(),
    ]);

    // Helper function to count duplicates based on a key
    const countDuplicates = (dataArray, key) => {
      const countMap = {};
      dataArray.forEach((item) => {
        const value = item[key];
        if (countMap[value]) {
          countMap[value]++;
        } else {
          countMap[value] = 1;
        }
      });
      return countMap;
    };

    // Count duplicates in API data by stock_name
    const apiDuplicates = countDuplicates(apiData, "stock_name");

    // Count duplicates in Typesense data by id
    const typesenseDuplicates = countDuplicates(typeSenseRecords, "id");

    // Filter out non-duplicate records and count only the duplicates
    const apiDuplicateCount = Object.values(apiDuplicates).filter(
      (count) => count > 1
    ).length;
    const typesenseDuplicateCount = Object.values(typesenseDuplicates).filter(
      (count) => count > 1
    ).length;

    console.log("Duplicate API records:", apiDuplicateCount);
    console.log("Duplicate Typesense records:", typesenseDuplicateCount);

    // Arrays to store mismatches
    const mismatchedISINs = [];
    const mismatchedStatuses = [];

    // Compare data (same logic as before)
    typeSenseRecords.forEach((record) => {
      const matchingApiRecords = apiData.filter(
        (item) => item.stock_name === record.id
      );

      if (matchingApiRecords.length > 0) {
        matchingApiRecords.forEach((apiRecord) => {
          if (
            apiRecord.new_isin &&
            apiRecord.new_isin.trim() !== record.typeSenseIsin.trim()
          ) {
            mismatchedISINs.push({
              company_Symbol: record.id,
              typeSenseId: record.id,
              apiNewIsin: apiRecord.new_isin,
              typeSenseISIN: record.typeSenseIsin,
            });
          }

          if (
            apiRecord.status &&
            apiRecord.status.trim() !==
              record.typeSenseShariahCompliantStatus.trim()
          ) {
            mismatchedStatuses.push({
              company_Symbol: record.id,
              typeSenseId: record.id,
              apiStatus: apiRecord.status,
              typeSenseStatus: record.typeSenseShariahCompliantStatus,
            });
          }
        });
      }
    });
    console.log("Comaparing Api and typesense data completed");

    return {
      ISINcount: mismatchedISINs.length,
      StatusCount: mismatchedStatuses.length,
      mismatchedISINs,
      mismatchedStatuses,
      apiDuplicateCount,
      typesenseDuplicateCount,
    };
  } catch (error) {
    console.error("Error comparing API with Typesense:", error.message);
    throw new Error("Failed to compare API with Typesense");
  }
}

async function compareComplianceWithAPI() {
  try {
    // Fetch data from both sources
    const [apiData, complianceRecords] = await Promise.all([
      fetchDataFromAPI(),
      typesense_compliance_collection_2(),
    ]);

    // Map API data for faster lookups
    const apiDataMap = apiData.reduce((map, item) => {
      map[item.stock_name] = {
        new_isin: item.new_isin,
        status: item.status,
      };
      return map;
    }, {});

    // Arrays to store mismatches
    const complianceMismatchedISINs = [];
    const complianceMismatchedStatuses = [];

    // Compare data
    complianceRecords.forEach((record) => {
      const apiRecord = apiDataMap[record.id];

      if (apiRecord) {
        // Compare ISINs
        if (apiRecord.new_isin && apiRecord.new_isin !== record.typeSenseIsin) {
          complianceMismatchedISINs.push({
            company_Symbol: record.id,
            typeSenseId: record.id,
            apiNewIsin: apiRecord.new_isin,
            complianceIsin: record.typeSenseIsin,
          });
        }

        // Compare Shariah compliance statuses
        if (apiRecord.status && apiRecord.status !== record.typeSenseStatus) {
          complianceMismatchedStatuses.push({
            company_Symbol: record.id,
            typeSenseId: record.id,
            apiStatus: apiRecord.status,
            complianceStatus: record.typeSenseStatus,
          });
        }
      }
    });

    return {
      complianceISINcount: complianceMismatchedISINs.length,
      complianceStatusCount: complianceMismatchedStatuses.length,
      complianceMismatchedISINs,
      complianceMismatchedStatuses,
    };
  } catch (error) {
    console.error("Error comparing Compliance with API:", error.message);
    throw new Error("Failed to compare Compliance with API");
  }
}

async function compareTypesenseCollections() {
  try {
    // Fetch data from both Typesense collections
    const [companyProfileRecords, complianceRecords] = await Promise.all([
      typesense_company_profile_collection(),
      typesense_compliance_collection_2(),
    ]);

    // Map compliance records for quick lookup
    const complianceMap = new Map();
    complianceRecords.forEach((record) => {
      complianceMap.set(record.id, {
        typeSenseIsin: record.typeSenseIsin,
        typeSenseStatus: record.typeSenseStatus,
      });
    });

    // Arrays to store mismatches
    const complianceMismatchedISINs = [];
    const complianceMismatchedStatuses = [];

    // Compare data
    companyProfileRecords.forEach((record) => {
      const complianceRecord = complianceMap.get(record.id);

      if (complianceRecord) {
        // Compare ISINs
        if (
          complianceRecord.typeSenseIsin &&
          complianceRecord.typeSenseIsin !== record.typeSenseIsin
        ) {
          complianceMismatchedISINs.push({
            company_Symbol: record.id,
            typeSenseId: record.id,
            complianceIsin: complianceRecord.typeSenseIsin,
            typeSenseIsin: record.typeSenseIsin,
          });
        }

        // Compare Shariah compliance statuses
        if (
          complianceRecord.typeSenseStatus &&
          complianceRecord.typeSenseStatus !==
            record.typeSenseShariahCompliantStatus
        ) {
          complianceMismatchedStatuses.push({
            company_Symbol: record.id,
            typeSenseId: record.id,
            complianceStatus: complianceRecord.typeSenseStatus,
            typeSenseStatus: record.typeSenseShariahCompliantStatus,
          });
        }
      }
    });

    return {
      complianceISINcount: complianceMismatchedISINs.length,
      complianceStatusCount: complianceMismatchedStatuses.length,
      complianceMismatchedISINs,
      complianceMismatchedStatuses,
    };
  } catch (error) {
    console.error("Error comparing Typesense collections:", error.message);
    throw new Error("Failed to compare Typesense collections");
  }
}

// Fetch data from the external API
async function fetchDataFromAPI() {
  console.log("Getting Data from API........");
  try {
    const response = await axios.get(
      "https://beta.infomanav.in/keep/finnhub_api_dev/prod/report/ALL_report_last_update.php",
      {
        timeout: 60000, // Increase timeout to 60 seconds
      }
    );
    console.log("API Data get successfully");
    return response.data;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error.message);
    } else {
      console.error("Error fetching data from API:", error.message);
    }
    throw new Error("Failed to fetch data from API");
  }
}

async function typesense_company_profile_collection() {
  let allRecords = [];
  let page = 1;
  let hasMoreRecords = true;

  console.log("Getting Data from Typesense........");
  while (hasMoreRecords) {
    try {
      const response = await axios.get(
        "https://h3ques1ic9vt6z4rp-1.a1.typesense.net/collections/company_profile_collection/documents/search",
        {
          params: {
            q: "*",
            per_page: 250,
            page: page,
          },
          headers: {
            "X-TYPESENSE-API-KEY": process.env.TS_API_KEY_PROD,
          },
        }
      );

      const records = response.data.hits.map((hit) => ({
        id: hit.document.id,
        typeSenseIsin: hit.document.isin,
        typeSenseShariahCompliantStatus: hit.document.shariahCompliantStatus,
      }));

      if (records.length > 0) {
        allRecords = allRecords.concat(records);
        page += 1;
      } else {
        hasMoreRecords = false;
      }
    } catch (error) {
      console.error("Error fetching TypeSenseCP records:", error.message);
      throw new Error("Failed to fetch TypeSense records");
    }
  }

  return allRecords;
}

async function typesense_compliance_collection_2() {
  let allRecords = [];
  let page = 1;
  let hasMoreRecords = true;

  while (hasMoreRecords) {
    try {
      const response = await axios.get(
        "https://h3ques1ic9vt6z4rp-1.a1.typesense.net/collections/compliance_collection_2/documents/search",
        {
          params: {
            q: "*",
            per_page: 250,
            page: page,
          },
          headers: {
            "X-TYPESENSE-API-KEY": process.env.TS_API_KEY_PROD,
          },
        }
      );

      const records = response.data.hits.map((hit) => ({
        id: hit.document.id,
        typeSenseIsin: hit.document.isin,
        typeSenseStatus: hit.document.status,
      }));

      if (records.length > 0) {
        allRecords = allRecords.concat(records);
        page += 1;
      } else {
        hasMoreRecords = false;
      }
    } catch (error) {
      console.error("Error fetching TypeSenseCM records:", error.message);
      throw new Error("Failed to fetch TypeSense records");
    }
  }

  return allRecords;
}

router.get("/company_profile_collection", async (req, res) => {
  try {
    // Fetch and compare data
    const [
      apiComparisonResult,
      // typesenseComparisonResult,
      // complianceComparisonResult,
    ] = await Promise.all([
      compareApiWithTypesense(),
      // compareTypesenseCollections(),
      // compareComplianceWithAPI(), // Add the new comparison function
    ]);

    // Combine the results from all comparisons
    const combinedResults = {
      apiComparison: apiComparisonResult,
      // typesenseComparison: typesenseComparisonResult,
      // complianceComparison: complianceComparisonResult, // Include the new results
    };

    // Return the combined results
    res.json(combinedResults);
  } catch (error) {
    console.error("Error processing comparisons:", error.message);
    res.status(500).send("Error processing comparisons");
  }
});

router.get("/single/:symbol", async (req, res) => {
  const symbol = req.params.symbol;

  try {
    // get company_profile data from ts
    const companyProfile = await axios.get(
      `https://h3ques1ic9vt6z4rp-1.a1.typesense.net/collections/company_profile_collection/documents/${symbol}`,
      {
        headers: {
          "X-TYPESENSE-API-KEY": process.env.TS_API_KEY_PROD,
        },
      }
    );

    if (!companyProfile.data) {
      return res.status(404).json({
        error: "Symbol not found in company_profile_collection Typesense",
      });
    }

    const { compliantRanking, id, isin, shariahCompliantStatus } =
      companyProfile.data;

    // get complianceMerlin data from ts
    const complianceMerlin = await axios.get(
      `https://h3ques1ic9vt6z4rp-1.a1.typesense.net/collections/compliance_collection_2/documents/${isin}`,
      {
        headers: {
          "X-TYPESENSE-API-KEY": process.env.TS_API_KEY_PROD,
        },
      }
    );

    if (!complianceMerlin) {
      return res.status(404).json({
        error: "Symbol not found in compliance_collection_2 Typesense",
      });
    }

    const {
      id: complianceId,
      isin: complianceIsin,
      ranking,
      status,
      stockName,
    } = complianceMerlin.data;

    const db_data = await axios.get(
      "https://beta.infomanav.in/keep/finnhub_api_dev/prod/report/ALL_report_last_update.php"
    );

    if (!db_data.data) {
      return res.status(404).json({ error: "Symbol not found in DB API" });
    }

    const reportData = db_data.data;
    const matchingSymbol = reportData.find((item) => item.stock_name === id);

    if (matchingSymbol) {
      var {
        stock_name,
        isin: reportIsin,
        new_isin,
        status: reportStatus,
        ranking: reportRanking,
      } = matchingSymbol;
    } else {
      var stock_name = null,
        reportIsin = null,
        new_isin = null,
        reportStatus = null,
        reportRanking = null;
    }

    const trimmedIsin = isin.trim();
    const trimmedComplianceIsin = complianceIsin.trim();
    const trimmedReportIsin = reportIsin ? reportIsin.trim() : null;

    const trimmedRanking = compliantRanking.toString().trim();
    const trimmedComplianceRanking = ranking.toString().trim();
    const trimmedReportRanking = reportRanking
      ? reportRanking.toString().trim()
      : null;

    const trimmedStatus = shariahCompliantStatus.trim();
    const trimmedComplianceStatus = status.trim();
    const trimmedReportStatus = reportStatus ? reportStatus.trim() : null;

    // Field consistency checks
    const isinMatch =
      trimmedIsin === trimmedComplianceIsin &&
      trimmedIsin === trimmedReportIsin;
    const rankingMatch =
      trimmedRanking === trimmedComplianceRanking &&
      trimmedRanking === trimmedReportRanking;
    const statusMatch =
      trimmedStatus === trimmedComplianceStatus &&
      trimmedStatus === trimmedReportStatus;

    res.json({
      CompanyProfileTS: {
        compliantRanking,
        symbol: id,
        isin,
        shariahCompliantStatus,
      },
      complianceMerlinTS: {
        id: complianceId,
        isin: complianceIsin,
        ranking,
        status,
        stockName,
      },
      db_report: {
        stock_name,
        isin: reportIsin,
        new_isin,
        status: reportStatus,
        ranking: reportRanking,
      },
      match: {
        isinMatch,
        rankingMatch,
        statusMatch,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.response) {
      if (error.response.config.url.includes("company_profile_collection")) {
        res.status(404).json({
          error: "Symbol not found in company_profile_collection Typesense",
        });
      } else if (
        error.response.config.url.includes("compliance_collection_2")
      ) {
        res.status(404).json({
          error: "Symbol not found in compliance_collection_2 Typesense",
        });
      } else if (
        error.response.config.url.includes("report/ALL_report_last_update")
      ) {
        res.status(404).json({ error: "Symbol not found in DB  API" });
      } else {
        res
          .status(500)
          .json({ error: "An unknown error occurred", details: error.message });
      }
    } else {
      res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
});

export default router;
