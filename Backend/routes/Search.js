import express from "express";
import CompanyProfile from "../models/CompanyProfile.js";
import SymbolMaster from "../models/SymbolMaster.js";
import { Op } from "sequelize";


const router = express.Router();

router.get("/s", async (req, res) => {
  try {
    const searchTerm = req.query.q || "";
    const searchBy = req.query.searchBy || "name";
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const page = Math.floor(offset / limit) + 1;

    let companyProfileCondition = {};
    let symbolMasterCondition = {};

    if (searchBy === "name") {
      companyProfileCondition = { name: { [Op.like]: `%${searchTerm}%` } };
      symbolMasterCondition = { description: { [Op.like]: `%${searchTerm}%` } };
    } else if (searchBy === "symbol") {
      companyProfileCondition = {
        company_symbol: { [Op.like]: `${searchTerm}` },
      };
      symbolMasterCondition = { symbol: { [Op.like]: `${searchTerm}` } };
    } else if (searchBy === "isin") {
      companyProfileCondition = { isin: { [Op.like]: `${searchTerm}` } };
      symbolMasterCondition = { isin: { [Op.like]: `${searchTerm}` } };
    }

    const companyProfiles = await CompanyProfile.findAndCountAll({
      where: companyProfileCondition,
      attributes: ["company_symbol", "isin", "name", "logo"],
      limit: limit,
      offset: offset,
    });

    const symbolMasters = await SymbolMaster.findAndCountAll({
      where: symbolMasterCondition,
      attributes: ["symbol", "isin", "description"],
      limit: limit,
      offset: offset,
    });

    const suggestions = {
      companyProfiles: companyProfiles.rows.map((profile) => ({
        type: "CompanyProfile",
        symbol: profile.company_symbol,
        name: profile.name,
        isin: profile.isin,
        logo: profile.logo,
      })),
      symbolMasters: symbolMasters.rows.map((master) => ({
        type: "SymbolMaster",
        symbol: master.symbol,
        description: master.description,
        isin: master.isin,
      })),
    };

    const totalResults = companyProfiles.count + symbolMasters.count;
    const totalPages = Math.ceil(totalResults / limit);

    if (totalResults === 0) {
      return res.status(200).json({
        message: "No results found",
        suggestions,
        count: 0,
        totalPages,
        page,
      });
    }

    res.status(200).json({
      suggestions,
      count:
        suggestions.companyProfiles.length + suggestions.symbolMasters.length,
      totalResults,
      totalPages,
      page,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error performing search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
