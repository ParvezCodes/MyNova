import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { URL } from "../App.jsx";
import Modal from "../Components/Modal.jsx";
import toast from "react-hot-toast";
import Loader from "../Components/Loader.jsx";

const WRONG_ISIN_CP_SM = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isin, setIsin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const handleFix = () => {
    setModalOpen(true);
  };

  const handleConfirm = () => {
    toast.success("ISIN Fixed");
    setModalOpen(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${URL}/api/v1/isin/compareIsinCpSm`, {
          params: { page, limit },
          withCredentials: true,
        });
        console.log(res.data.mismatchedISINs);
        setIsin(res.data.mismatchedISINs);
        setTotalPages(res.data.totalPages || 1); // Set totalPages from response if available
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit]);

  // Directly using map without memoization
  const renderedRows = isin.map((item, index) => (
    <tr key={index}>
      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        <img
          src={item.profileLogo}
          alt={item.companyName || "N/A"}
          className="w-14 h-14 bg-gray-100 object-cover object-center flex-shrink-0 mr-4"
        />
      </td>
      <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {item.symbol || "N/A"}
      </td>
      <td className="px-12 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {item.companyName || "N/A"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
        {item.masterIsin || "N/A"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
        {item.profileIsin || "N/A"}
      </td>

      <td className="px-4 py-4 text-sm whitespace-nowrap">
        <div className="flex items-center gap-x-6">
          <button
            className="text-white bg-gray-700 rounded px-4 py-1"
            onClick={handleFix}
          >
            Fix
          </button>
        </div>
      </td>
    </tr>
  ));

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <section className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center gap-x-3 mt-5">
            <h1 className="text-lg font-medium text-gray-800">
              Wrong ISIN Between prod_company_profile & Symbol_Master
            </h1>
          </div>

          <div className="flex flex-col mt-6">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Logo
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Symbol
                        </th>
                        <th
                          scope="col"
                          className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Company Name
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-green-500 dark:text-green-400"
                        >
                          ProfileMaster ISIN
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-yellow-500 dark:text-yellow-400"
                        >
                          CompanyProfile ISIN
                        </th>

                        <th
                          scope="col"
                          className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                        >
                          Operation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                      {renderedRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-4 text-gray-700 dark:text-gray-300"
                          >
                            No records found
                          </td>
                        </tr>
                      ) : (
                        renderedRows
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6 mb-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:opacity-50"
            >
              <IoIosArrowBack />
            </button>
            <span className="text-gray-900 dark:text-gray-900">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:opacity-50"
            >
              <IoIosArrowForward />
            </button>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            message="ISIN is replaced by Master ISIN"
          />
        </section>
      )}
    </>
  );
};

export default WRONG_ISIN_CP_SM;
