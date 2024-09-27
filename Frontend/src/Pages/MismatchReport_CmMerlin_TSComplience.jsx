import React, { useState } from "react";
import axios from "axios";
import { URL } from "../App";
import MismatchTable from "../Components/MismatchTable";

const MismatchReport_CmMerlin_TSComplience = () => {
  const [date, setDate] = useState("");
  const [mismatches, setMismatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      if (response.data.mismatches.length > 0) {
        setMismatches(response.data.mismatches);
      } else {
        setMismatches([]);
        alert("No mismatches found");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Report Mismatch in TYS and ComplianceMerlin
      </h1>

      {/* Search Bar and Button Div */}
      <div className="flex mb-4">
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full mr-2"
          placeholder="Enter Date (DD-MM-YYYY)"
          required
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Loading..." : "Check Compliance"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Table Div */}
      {mismatches.length > 0 && (
        <div className="overflow-x-auto">
          <MismatchTable mismatches={mismatches} />
        </div>
      )}
    </div>
  );
};

export default MismatchReport_CmMerlin_TSComplience;
