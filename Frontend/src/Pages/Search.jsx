import React, { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { URL } from "../App";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [results, setResults] = useState({
    companyProfiles: [],
    symbolMasters: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 15;

  const handleSearch = async (page = 1) => {
    setLoading(true);
    setError(null);
    setNoResults(false);

    const offset = (page - 1) * limit;

    try {
      const response = await axios.get(`${URL}/api/v1/search/s`, {
        params: {
          q: searchTerm,
          searchBy: searchBy,
          limit: limit,
          offset: offset,
        },
      });

      const { suggestions, totalPages } = response.data;

      setResults(suggestions);
      setTotalPages(totalPages);
      console.log(response);

      if (response.data.count === 0) {
        setNoResults(true);
      }
    } catch (err) {
      setError("Error fetching search results.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResults({
      companyProfiles: [],
      symbolMasters: [],
    });
    setSearchTerm("");
    setPage(1);
    window.location.reload();
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch(page);
    }
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    handleSearch(newPage);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 h-[94vh]">
      <div className="flex mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border border-gray-300 ml-2 p-2 focus:outline-none focus:ring-2 focus:ring-gray-900 rounded"
        >
          <option value="name">Name</option>
          <option value="symbol">Symbol</option>
          <option value="isin">ISIN</option>
        </select>
        <button
          onClick={() => handleSearch(1)}
          disabled={loading}
          className={`ml-2 px-4 py-2 bg-gray-900 text-white rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
          }`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        <button
          onClick={handleClear}
          className="ml-2 px-4 py-2 bg-gray-900 text-white rounded"
        >
          Clear
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {noResults && <p className="text-gray-500 mb-4">No results found</p>}
      <div className="flex">
        <div className="w-1/2 pr-2">
          <h2 className="text-xl font-semibold mb-2">
            Company Profiles (prod_company_profile)
          </h2>
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-900 text-white">
              <tr>
                <th className="border-b px-4 py-2 text-left">Logo</th>
                <th className="border-b px-4 py-2 text-left">Name</th>
                <th className="border-b px-4 py-2 text-left">Symbol</th>
                <th className="border-b px-4 py-2 text-left">ISIN</th>
              </tr>
            </thead>
            <tbody>
              {results.companyProfiles.map((profile, index) => (
                <tr key={index}>
                  <td className="border-b px-4">
                    <img
                      src={profile.logo}
                      alt={profile.symbol}
                      className="h-12 w-12"
                    />
                  </td>
                  <td className="border-b px-4 py-2 ">{profile.name}</td>
                  <td className="border-b px-4 py-2">{profile.symbol}</td>
                  <td className="border-b px-4 py-2 text-blue-600">
                    {profile.isin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-1/2 pl-2">
          <h2 className="text-xl font-semibold mb-2">
            Symbol Masters (lambda_symbol_master)
          </h2>
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-900 text-white">
              <tr>
                <th className="border-b px-4 py-2 text-left">Description</th>
                <th className="border-b px-4 py-2 text-left">Symbol</th>
                <th className="border-b px-4 py-2 text-left ">ISIN</th>
              </tr>
            </thead>
            <tbody>
              {results.symbolMasters.map((master, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">{master.description}</td>
                  <td className="border-b px-4 py-2">{master.symbol}</td>
                  <td className="border-b px-4 py-2 text-blue-600">
                    {master.isin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 ? (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-900 text-white rounded mx-2"
          >
            <IoIosArrowBack />
          </button>
          <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-900 text-white rounded mx-2"
          >
            <IoIosArrowForward />
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Search;
