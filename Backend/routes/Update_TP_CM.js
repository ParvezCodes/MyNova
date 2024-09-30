import express from "express";
import axios from "axios";
import ForTypesenseUpdate from "../models/TypesenseUpdateCM.js";
import UpdatedTypesense from "../models/UpdatedTS.js";

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
      `https://api.nova.musaffa.com/api/get_compliance_data?main_ticker=&stock_name=${encodeURIComponent(
        symbol
      )}`
    );

    if (!apiResponse.data || !apiResponse.data.isin) {
      return res.status(404).send(`No Data found for ${symbol}.`);
    }

    const apiData = apiResponse.data;
    // console.log("API Data:", apiData);

    // Send data to the Typesense API
    // const typesenseResponse = await axios.post(
    //   `https://beta.infomanav.in/keep/finnhub_api_dev/Typesense/insert.php`,
    //   apiData,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // const {
    //   id: typesense_id,
    //   isin,
    //   stockName: stock_name,
    // } = typesenseResponse.data;

    // await UpdatedTypesense.create({
    //   typesense_id,
    //   isin,
    //   stock_name,
    // });

    // res.status(200).json({
    //   message: "Data successfully updated.",
    //   fetchedData: apiData,
    //   typesenseResponse: typesenseResponse.data,
    // });
    res
      .status(200)
      .json({ message: "Data successfully updated.", fetchedData: apiData });
  } catch (error) {
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // More specific error responses can be added here based on error type
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getUpdatedrecords", async (req, res) => {
  try {
    const updatedRecords = await UpdatedTypesense.findAll();
    res.status(200).json({updatedRecords});
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" ,error});
  }
});

export default router;
