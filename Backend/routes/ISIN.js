import express from "express";
import CompanyProfile from "../models/CompanyProfile.js";
import SymbolMaster from "../models/SymbolMaster.js";
import ComplianceMerlin from "../models/ComplianceMerlin.js";
import axios from "axios";

const router = express.Router();

router.get("/compareIsinCpSm", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid page or limit parameter" });
    }

    const symbolMasterRecords = await SymbolMaster.findAll({
      attributes: ["symbol", "isin", "description"],
    });

    // Convert symbol master records to an object for fast lookup
    const symbolMasterLookup = {};
    symbolMasterRecords.forEach((record) => {
      symbolMasterLookup[record.symbol] = {
        isin: record.isin,
        description: record.description,
      };
    });

    // Fetch only company profiles based on the symbols
    const companyProfiles = await CompanyProfile.findAll({
      where: {
        company_symbol: Object.keys(symbolMasterLookup),
      },
      attributes: ["company_symbol", "isin", "name", "logo"],
    });

    const mismatchedISINs = [];

    // Compare ISINs and find mismatches
    companyProfiles.forEach((profile) => {
      const masterRecord = symbolMasterLookup[profile.company_symbol];
      if (masterRecord) {
        if (profile.isin !== masterRecord.isin) {
          mismatchedISINs.push({
            symbol: profile.company_symbol,
            masterIsin: masterRecord.isin,
            profileIsin: profile.isin,
            companyName: profile.name,
            description: masterRecord.description,
            logo: profile.logo,
          });
        }
      }
    });

    const totalRecords = mismatchedISINs.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResults = mismatchedISINs.slice(
      startIndex,
      startIndex + limit
    );

    const response = {
      mismatchedISINs: paginatedResults,
      count: paginatedResults.length,
      totalRecords,
      totalPages,
      currentPage: page,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error comparing ISINs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function fetchAllTypeSenseData() {
  try {
    const response = await axios.get(
      "https://kn2smbywvz1li8hrp-1.a1.typesense.net/collections/company_profile_collection_nova/documents/export",
      {
        headers: {
          "X-TYPESENSE-API-KEY": process.env.TS_API_KEY_UAT,
          "Content-Type": "application/json",
        },
      }
    );

    // Aggregate all documents into an array
    const typeSenseDataArray = [];
    // Assuming the data is a string of JSON objects separated by newlines
    const responseData = response.data.split("\n");

    responseData.forEach((line) => {
      if (line.trim()) {
        try {
          const doc = JSON.parse(line);
          if (doc.ticker) {
            typeSenseDataArray.push({
              ticker: doc.ticker,
              isin: doc.isin,
              name: doc.name,
              logo: doc.logo,
            });
          }
        } catch (parseError) {
          console.error(
            "Error parsing TypeSense document:",
            parseError.message
          );
        }
      }
    });

    // Convert TypeSense data to a lookup map for efficient access
    const typeSenseLookup = {};
    typeSenseDataArray.forEach((doc) => {
      typeSenseLookup[doc.ticker] = {
        isin: doc.isin,
        name: doc.name,
        logo: doc.logo,
      };
    });

    return typeSenseLookup;
  } catch (error) {
    console.error("Error fetching TypeSense data:", error.message);
    throw new Error("Failed to fetch TypeSense data");
  }
}

// Fetch company profiles from database
async function fetchCompanyProfiles() {
  return CompanyProfile.findAll({
    attributes: ["company_symbol", "isin", "name", "logo"],
  });
}

// Compare ISINs between TypeSense and company profiles
router.get("/compareIsinTS", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Invalid page or limit parameter" });
    }

    // Fetch all TypeSense data
    const typeSenseLookup = await fetchAllTypeSenseData();

    // Fetch all company profiles
    const companyProfiles = await fetchCompanyProfiles();
    const mismatchedISINs = [];

    // Process each company profile
    for (const profile of companyProfiles) {
      const typeSenseData = typeSenseLookup[profile.company_symbol];

      if (typeSenseData && typeSenseData.isin) {
        // Compare ISINs
        if (profile.isin !== typeSenseData.isin) {
          mismatchedISINs.push({
            profilesymbol: profile.company_symbol,
            profileIsin: profile.isin,
            typeSenseIsin: typeSenseData.isin,
            profileName: profile.name,
            typeSenseName: typeSenseData.name,
            profileLogo: profile.logo,
          });
        }
      }
    }

    // Pagination logic for the final result
    const totalRecords = mismatchedISINs.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResults = mismatchedISINs.slice(
      startIndex,
      startIndex + limit
    );

    const response = {
      mismatchedISINs: paginatedResults,
      count: paginatedResults.length,
      totalRecords,
      totalPages,
      currentPage: page,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error comparing ISINs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function fetchAllTypeSenseData2() {
  try {
    const response = await axios.get(
      "https://kn2smbywvz1li8hrp-1.a1.typesense.net/collections/company_profile_collection_nova/documents/export",
      {
        headers: {
          "X-TYPESENSE-API-KEY": process.env.TS_API_KEY_UAT,
          "Content-Type": "application/json",
        },
      }
    );

    // Aggregate all documents into an array
    const typeSenseDataArray = [];
    const responseData = response.data.split("\n");

    responseData.forEach((line) => {
      if (line.trim()) {
        try {
          const doc = JSON.parse(line);
          if (doc.id && doc.shariahCompliantStatus) {
            typeSenseDataArray.push({
              id: doc.id,
              shariahCompliantStatus: doc.shariahCompliantStatus,
            });
          }
        } catch (parseError) {
          console.error(
            "Error parsing TypeSense document:",
            parseError.message
          );
        }
      }
    });

    if (typeSenseDataArray.length === 0) {
      console.warn("No TypeSense data found.");
    }

    // Convert TypeSense data to a lookup map for efficient access
    const typeSenseLookup = {};
    typeSenseDataArray.forEach((doc) => {
      typeSenseLookup[doc.id] = {
        shariahCompliantStatus: doc.shariahCompliantStatus,
      };
    });

    return {
      typeSenseLookup,
      totalCount: typeSenseDataArray.length,
    };
  } catch (error) {
    console.error("Error fetching TypeSense data:", error.message);
    throw new Error("Failed to fetch TypeSense data");
  }
}

async function fetchComplianceMerlin() {
  return ComplianceMerlin.findAll({
    attributes: ["stock_name", "status"],
  });
}

// Compare Shariah compliance status between TypeSense and compliance_merlin
router.get("/compareShariahStatus", async (req, res) => {
  try {
    // Fetch all TypeSense data
    const { typeSenseLookup, totalCount } = await fetchAllTypeSenseData2();

    // Check if TypeSense data is empty
    if (totalCount === 0) {
      return res.status(404).json({ error: "No TypeSense data found" });
    }

    // Fetch all company profiles
    const companyProfiles = await fetchCompanyProfiles();

    // Check if company profiles are empty
    if (companyProfiles.length === 0) {
      return res.status(404).json({ error: "No company profiles found" });
    }

    // Fetch all compliance_merlin data
    const complianceMerlin = await fetchComplianceMerlin();

    // Check if compliance_merlin data is empty
    if (complianceMerlin.length === 0) {
      return res.status(404).json({ error: "No compliance data found" });
    }

    const complianceLookup = {};
    complianceMerlin.forEach((item) => {
      complianceLookup[item.stock_name] = item.status;
    });

    const mismatchedShariahStatus = [];

    // Process each company profile
    for (const profile of companyProfiles) {
      const typeSenseData = typeSenseLookup[profile.company_symbol];

      if (typeSenseData) {
        // Fetch the TypeSense and compliance status
        const typeSenseShariahStatus = typeSenseData.shariahCompliantStatus;
        const complianceStatus = complianceLookup[profile.company_symbol];

        // Debugging: Log the comparison
        console.log("Comparing Shariah Status:", {
          profileSymbol: profile.company_symbol,
          typeSenseStatus: typeSenseShariahStatus,
          complianceStatus: complianceStatus,
        });

        // Check for mismatches
        if (
          typeSenseShariahStatus !== complianceStatus ||
          typeSenseShariahStatus === undefined ||
          typeSenseShariahStatus === null
        ) {
          mismatchedShariahStatus.push({
            profilesymbol: profile.company_symbol,
            typeSenseShariahStatus: typeSenseShariahStatus || "Missing",
            complianceMerlinStatus: complianceStatus || "Missing",
            profileName: profile.name,
          });
        }
      } else {
        // If no TypeSense data is found for the profile
        const complianceStatus = complianceLookup[profile.company_symbol];
        mismatchedShariahStatus.push({
          profilesymbol: profile.company_symbol,
          typeSenseShariahStatus: "Missing",
          complianceMerlinStatus: complianceStatus || "Missing",
          profileName: profile.name,
        });
      }
    }

    // Response with all mismatched Shariah statuses
    const response = {
      mismatchedShariahStatus,
      countShariah: mismatchedShariahStatus.length,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error comparing Shariah compliance:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
