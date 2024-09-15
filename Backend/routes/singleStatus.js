import express from "express";
import axios from "axios";
import CompanyProfile from "../models/CompanyProfile.js";
import ComplianceMerlin from "../models/ComplianceMerlin.js";

const router = express.Router();

async function fetchShariahStatusFromTypeSense(id) {
  try {
    const response = await axios.get(
      `https://kn2smbywvz1li8hrp-1.a1.typesense.net/collections/company_profile_collection_nova/documents/${id}`,
      {
        headers: {
          "X-TYPESENSE-API-KEY": process.env.TS_API_KEY_UAT,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // If no data or missing Shariah compliance status
    if (!data || !data.shariahCompliantStatus) {
      return {
        error: `Shariah compliance status not available for symbol '${id}' in TypeSense.`,
      };
    }

    return data.shariahCompliantStatus;
  } catch (error) {
    console.error("Error fetching TypeSense data:", error.message);
    return {
      error: `Failed to fetch TypeSense data for symbol '${id}': ${error.message}`,
    };
  }
}

async function fetchComplianceStatus(stockName) {
  try {
    const complianceData = await ComplianceMerlin.findOne({
      attributes: ["status"],
      where: { stock_name: stockName },
    });

    if (complianceData) {
      return complianceData.status;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching ComplianceMerlin data:", error.message);
    throw new Error("Failed to fetch ComplianceMerlin data");
  }
}

router.get("/compareShariahStatus/:symbol", async (req, res) => {
  const { symbol } = req.params;

  try {
    // Fetch company symbol details
    const companySymbol = await CompanyProfile.findOne({
      attributes: ["company_symbol", "logo"],
      where: { company_symbol: symbol },
    });

    if (!companySymbol) {
      return res.status(404).json({
        error: `Company symbol '${symbol}' not found in the database.`,
      });
    }

    // Fetch Shariah compliance status from TypeSense
    const typeSenseShariahStatus = await fetchShariahStatusFromTypeSense(
      symbol
    );

    if (typeSenseShariahStatus.error) {
      return res.status(404).json({ error: typeSenseShariahStatus.error });
    }

    // Fetch compliance status from ComplianceMerlin
    const complianceMerlinStatus = await fetchComplianceStatus(symbol);

    if (complianceMerlinStatus === null) {
      return res.status(404).json({
        error: `Compliance status not found for symbol '${symbol}' in ComplianceMerlin.`,
      });
    }

    // Send the response
    res.status(200).json({
      companySymbol: companySymbol.company_symbol,
      logo: companySymbol.logo,
      typeSenseShariahStatus,
      complianceMerlinStatus,
    });
  } catch (error) {
    console.error("Error comparing Shariah compliance status:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
