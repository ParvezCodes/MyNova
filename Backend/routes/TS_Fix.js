import express from "express";
import axios from "axios";
const router = express.Router();

const COMPLIANCE_DATA_API = process.env.COMPLIANCE_DATA_API;
const TYPESENSE_COMPLIANCE = process.env.TYPESENSE_COMPLIANCE;
const COMPLIANCE_X_TYPESENSE_API_KEY =
  process.env.COMPLIANCE_X_TYPESENSE_API_KEY;

router.get("/your-route/:company_symbol", async (req, res) => {
  const symbol = req.params.company_symbol;
  const apiUrl = `${COMPLIANCE_DATA_API}?main_ticker=&stock_name=${encodeURIComponent(
    symbol
  )}`;

  try {
    // Fetch data from the Compliance Data API
    const apiResponse = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const apidata = apiResponse.data;

    if (!apidata || Object.keys(apidata).length === 0) {
      return res.status(404).json({ error: "No data retrieved from API." });
    }

    const apiisin = apidata.isin;

    // Prepare to send data to Typesense
    const typesenseUrl = TYPESENSE_COMPLIANCE;
    const typesenseApiKey = COMPLIANCE_X_TYPESENSE_API_KEY;

    const response = await axios.post(typesenseUrl, apidata, {
      headers: {
        "Content-Type": "application/json",
        "X-TYPESENSE-API-KEY": typesenseApiKey,
      },
    });

    // Track API usage (you need to implement these functions)
    // await trackAPIUsage(
    //   "publish_report",
    //   req.user.id,
    //   JSON.stringify(apidata),
    //   "api compliance_collection_2",
    //   symbol,
    //   JSON.stringify(response.data)
    // );
    // await trackTypesenseAPIUsage(
    //   "publish_report",
    //   req.user.id,
    //   JSON.stringify(apidata),
    //   "api compliance_collection_2",
    //   symbol,
    //   JSON.stringify(response.data)
    // );

    // Respond with the Typesense response
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      // Track API usage error
      await trackAPIUsage(
        "publish_report",
        req.user.id,
        JSON.stringify(apidata),
        "api error compliance_collection_2",
        symbol,
        JSON.stringify(error.message)
      );
      await trackTypesenseAPIUsage(
        "publish_report",
        req.user.id,
        JSON.stringify(apidata),
        "api error compliance_collection_2",
        symbol,
        JSON.stringify(error.message)
      );

      res.status(error.response.status).json({ error: error.message });
    } else {
      // Handle other errors
      res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }
});

// Implement tracking functions
async function trackAPIUsage(
  operation,
  userId,
  apiData,
  errorType,
  companySymbol,
  response
) {
  // Add your tracking logic here
}

async function trackTypesenseAPIUsage(
  operation,
  userId,
  apiData,
  errorType,
  companySymbol,
  response
) {
  // Add your tracking logic here
}

module.exports = router;
