// Mismatch (prod_company_profile ) & (lambda_company_profile)

import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Components/Loader";

const MisMatch_PCP_LCP = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/compare/pcplcp`
        );
        console.log(response);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="body-font">
          <div className="container px-5 py-10 mx-auto">
            <h1 className="text-center font-bold m-4">
              Mismatch (prod_company_profile ) & (lambda_company_profile)
            </h1>
            <div className="flex flex-wrap -m-2">
              {data.length === 0 ? (
                <p className="text-center w-full">
                  No mismatched records found
                </p>
              ) : (
                data.map((record) => (
                  <div
                    key={record.company_symbol}
                    className="p-2 lg:w-1/3 md:w-1/2 w-full "
                  >
                    <div className="h-full flex items-center border-gray-800 border p-4 rounded-lg text-white bg-gray-900">
                      <img
                        alt={`${record.company_symbol} logo`}
                        className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                        src={record.logo}
                      />
                      <div className="flex-grow">
                        <h2 className="text-white title-font font-medium">
                          {record.company_symbol}
                        </h2>
                        {Object.entries(record.mismatches).map(
                          ([field, { lambda, prod }]) => (
                            <div
                              key={`${record.company_symbol}-${field}`}
                              className="mb-2"
                            >
                              <p className="text-white">
                                <span>Mismatched {field}:</span>
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-400">Lambda:</span>{" "}
                                {lambda}
                              </p>
                              <p className="text-sm">
                                <span className="text-gray-400">Prod:</span>{" "}
                                {prod}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default MisMatch_PCP_LCP;
