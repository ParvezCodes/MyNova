import React, { useState } from "react";
import axios from "axios";
import Loader from "../Components/Loader"; // Assuming you have a Loader component

const SingleShariahStatus = () => {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchStatus = async () => {
    // Reset previous data and error
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/statusSingle/compareShariahStatus/${symbol}`
      );
      setData(response.data);
      setSymbol(""); // Optionally clear the input field
    } catch (err) {
      // Convert the error to a string if it's an object
      const errorMessage = err.response?.data?.error || "Error fetching data";
      setError(
        typeof errorMessage === "object"
          ? JSON.stringify(errorMessage)
          : errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Shariah Compliance Status Checker
      </h1>

      <div className="mt-6">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter Company Symbol"
          className="p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleFetchStatus}
          className={`ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !symbol}
        >
          {loading ? "Fetching..." : "Fetch Status"}
        </button>
      </div>

      {/* Display Loader */}
      {loading && <Loader />}

      {/* Display Error */}
      {error && (
        <div className="mt-4 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Display Data */}
      {data && !loading && !error && (
        <div className="mt-6 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500 dark:text-gray-400">
                      Logo
                    </th>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500 dark:text-gray-400">
                      Company Symbol
                    </th>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500 dark:text-gray-400">
                      TypeSense Shariah Status
                    </th>
                    <th className="py-3.5 px-4 text-sm font-medium text-left text-gray-500 dark:text-gray-400">
                      Compliance Merlin Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {data.logo ? (
                        <img
                          src={data.logo}
                          alt="Company Logo"
                          className="w-12 h-12"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {data.companySymbol || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {data.typeSenseShariahStatus || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {data.complianceMerlinStatus || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleShariahStatus;
