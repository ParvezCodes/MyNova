import express from "express";
import axios from "axios";
import ForTypesenseUpdate from "../models/TypesenseUpdateCM.js";

const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    const data = await ForTypesenseUpdate.findAll({
      attributes: [
        "id",
        "main_stock_name",
        "main_status",
        "secondary_status",
        "status_mismatch",
        "update_status",
      ],
    });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
});

router.post("/update", async (req, res) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).send("Error: Company symbol is required.");
  }

  try {
    const apiResponse = await axios.get(
      `https://novaapi.musaffa.us/api/get_compliance_data?main_ticker=&stock_name=${encodeURIComponent(
        symbol
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!apiResponse.data || !apiResponse.data.isin) {
      return res.status(404).send(`No Data found for ${symbol}.`);
    }

    // Send data to the Typesense API
    // const response = await axios.post(TYPESENSE_COMPLIANCE, apidata, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-TYPESENSE-API-KEY": COMPLIANCE_X_TYPESENSE_API_KEY,
    //   },
    // });

    await ForTypesenseUpdate.update(
      { update_status: "Completed" },
      { where: { main_stock_name: symbol } }
    );

    res.status(200).json({ data: apiResponse.data });
  } catch (error) {
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
