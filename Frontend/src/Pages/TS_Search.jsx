import { useState } from "react";
import { URL } from "../App";
import axios from "axios";
import { CiSearch } from "react-icons/ci";

const TS_Search = () => {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!symbol) {
      setError("Enter Symbol to search");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${URL}/api/v1/ts/single/${symbol}`);
      setData(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[94vh] flex flex-col items-center justify-center  p-4">
      <div className=" shadow-lg rounded-lg p-8 max-w-6xl w-full bg-gray-900">
        <h1 className="text-2xl font-semibold text-gray-200 mb-4 text-center">
          Search Symbol
        </h1>

        <div className="flex items-center mb-4 space-x-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
            placeholder="Search Symbol..."
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <button
            className="bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-400"
            onClick={handleSearch}
          >
            {loading ? "Loading..." : <CiSearch size={26}/>}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="text-center text-red-400 mb-4">{error}</div>}

        {/* Table with Data */}
        {data && (
          <div className="mt-8">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr className="bg-gray-700">
                  <th
                    colSpan="2"
                    className="py-3.5 px-4 text-sm font-medium text-left text-gray-300"
                  >
                    CompanyProfile Typesense
                  </th>
                  <th
                    colSpan="2"
                    className="py-3.5 px-4 text-sm font-medium text-left text-gray-300"
                  >
                    ComplianceMerlin Typesense
                  </th>
                  <th
                    colSpan="2"
                    className="py-3.5 px-4 text-sm font-medium text-left text-gray-300"
                  >
                    DB Report
                  </th>
                  <th
                    colSpan="2"
                    className="py-3.5 px-4 text-sm font-medium text-left text-gray-300"
                  >
                    Match
                  </th>
                </tr>
                <tr className="bg-gray-600">
                  <th className="p-2 border border-gray-700 text-gray-300">
                    Field
                  </th>
                  <th className="p-2 border border-gray-700 text-gray-300">
                    Value
                  </th>
                  <th className="p-2 border border-gray-700 text-gray-300">
                    Field
                  </th>
                  <th className="p-2 border border-gray-700 text-gray-300">
                    Value
                  </th>
                  <th className="p-2 border border-gray-700 text-gray-300">
                    Field
                  </th>
                  <th className="p-2 border border-gray-700 text-gray-300">
                    Value
                  </th>
                  <th className="p-2 border border-gray-700 text-gray-300">
                    Field
                  </th>
                  <th className="p-2 border border-gray-700 text-gray-300">
                    isMatched
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 text-gray-300">
                <tr>
                  <td className="p-2 border border-gray-700">Symbol</td>
                  <td className="p-2 border border-gray-700">
                    {data.CompanyProfileTS.symbol}
                  </td>
                  <td className="p-2 border border-gray-700">Symbol</td>
                  <td className="p-2 border border-gray-700">
                    {data.complianceMerlinTS.stockName}
                  </td>
                  <td className="p-2 border border-gray-700">Symbol</td>
                  <td className="p-2 border border-gray-700">
                    {data.db_report.stock_name}
                  </td>
                  <td className="p-2 border border-gray-700">*</td>
                  <td className="p-2 border border-gray-700">*</td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-700">ISIN</td>
                  <td className="p-2 border border-gray-700">
                    {data.CompanyProfileTS.isin}
                  </td>
                  <td className="p-2 border border-gray-700">ISIN</td>
                  <td className="p-2 border border-gray-700">
                    {data.complianceMerlinTS.isin}
                  </td>
                  <td className="p-2 border border-gray-700">ISIN</td>
                  <td className="p-2 border border-gray-700">
                    {data.db_report.isin}
                  </td>
                  <td className="p-2 border border-gray-700">ISIN</td>
                  <td
                    className={`p-2 border border-gray-700 ${
                      data.match.isinMatch ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {data.match.isinMatch ? "True" : "False"}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-700">Ranking</td>
                  <td className="p-2 border border-gray-700">
                    {data.CompanyProfileTS.compliantRanking}
                  </td>
                  <td className="p-2 border border-gray-700">Ranking</td>
                  <td className="p-2 border border-gray-700">
                    {data.complianceMerlinTS.ranking}
                  </td>
                  <td className="p-2 border border-gray-700">Ranking</td>
                  <td className="p-2 border border-gray-700">
                    {data.db_report.ranking}
                  </td>
                  <td className="p-2 border border-gray-700">Ranking</td>

                  <td
                    className={`p-2 border border-gray-700 ${
                      data.match.rankingMatch
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {data.match.rankingMatch ? "True" : "False"}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-700">Status</td>
                  <td className="p-2 border border-gray-700">
                    {data.CompanyProfileTS.shariahCompliantStatus}
                  </td>
                  <td className="p-2 border border-gray-700">Status</td>
                  <td className="p-2 border border-gray-700">
                    {data.complianceMerlinTS.status}
                  </td>
                  <td className="p-2 border border-gray-700">Status</td>
                  <td className="p-2 border border-gray-700">
                    {data.db_report.status}
                  </td>
                  <td className="p-2 border border-gray-700">Status</td>
                  <td
                    className={`p-2 border border-gray-700 ${
                      data.match.statusMatch ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {data.match.statusMatch ? "True" : "False"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TS_Search;
