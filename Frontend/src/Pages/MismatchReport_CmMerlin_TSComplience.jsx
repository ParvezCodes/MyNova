import React, { useState } from "react";
import axios from "axios";
import { URL } from "../App";
import MismatchTable from "../Components/MismatchTable";

const MismatchReport_CmMerlin_TSComplience = () => {
  const [date, setDate] = useState("");
  const [mismatches, setMismatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [notFound, setNotFound] = useState(0);
  const [subTickernotFound, SetSubTickerNotFound] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMismatches([]);

    try {
      const response = await axios.post(
        `${URL}/api/v1/allreports/verify`,
        {
          date,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      if (response.data.mismatches.length > 0) {
        setMismatches(response.data.mismatches);
      } else {
        setMismatches([]);
        alert("No mismatches found");
      }

      setTotalCount(response.data.totalCount || 0);
      setNotFound(response.data.notFoundInTypesenseCount || 0);
      SetSubTickerNotFound(response.data.noTickerMatchCount || 0);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 text-gray-300 min-h-screen">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-white mb-6">
          Typesense vs Compliance Merlin Mismatch Report
        </h1>
        <p className="text-gray-400 mb-4">
          Compare records between TYS and ComplianceMerlin for a specific date.
        </p>

        {/* Search Bar */}
        <div className="flex items-center mb-6">
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-700 bg-gray-700 text-gray-300 rounded-md p-3 w-full mr-4 focus:ring focus:ring-blue-500"
            placeholder="Enter Date (DD-MM-YYYY)"
            required
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className={`bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-200 ${
              loading && "cursor-not-allowed"
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Check"}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}

        {/* Results Overview */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-md text-center">
              <p className="text-gray-400">Total Records Checked</p>
              <p className="text-xl font-bold text-gray-200">{totalCount}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md text-center">
              <p className="text-gray-400">Not Found in TS</p>
              <p className="text-xl font-bold text-gray-200">{notFound}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md text-center">
              <p className="text-gray-400">Subticker not found in ts</p>
              <p className="text-xl font-bold text-gray-200">
                {subTickernotFound}
              </p>
            </div>
          </div>
        )}

        {/* Mismatch Table */}
        {mismatches.length > 0 ? (
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md p-4 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">
              Mismatch Details
            </h2>
            <MismatchTable mismatches={mismatches} />
          </div>
        ) : (
          !loading &&
          !error && (
            <div className="text-gray-400 mt-6 text-center">
              No mismatches found for the selected date.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MismatchReport_CmMerlin_TSComplience;
