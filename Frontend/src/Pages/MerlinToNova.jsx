import React, { useState } from "react";
import { URL } from "../App";

const MerlinToNova = () => {
  const [symbol, setSymbol] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${URL}/api/v1/merlintonova/transfer/${symbol}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.text();
        setResult(data);
      } else {
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[94vh] bg-gray-100 ">
      <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-900 mt-8">
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Transfer Symbol from Merlin To Nova
        </h1>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="symbol"
            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            Enter Symbol:
          </label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={handleSymbolChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md mb-4 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className={`w-full p-2 text-white font-semibold rounded-md ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            }`}
          >
            {loading ? "Processing..." : "Transfer"}
          </button>
        </form>
        {result && (
          <div className="mt-4 text-lg text-gray-900 dark:text-gray-100">
            {result}
          </div>
        )}
        {error && (
          <div className="mt-4 text-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="mt-4 text-lg text-gray-900 dark:text-gray-100">
          Store in nova_beta.lambda_company_profile_3
        </div>
      </div>
    </div>
  );
};

export default MerlinToNova;
