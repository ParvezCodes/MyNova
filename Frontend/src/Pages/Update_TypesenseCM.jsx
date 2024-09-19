// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { URL } from "../App";
// import toast from "react-hot-toast";

// const Update_TypesenseCM = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.get(`${URL}/api/v1/tsupdate/getall`);
//       setData(res.data);
//     };

//     fetchData();
//   }, []);

//   const handleUpdate = async (symbol) => {
//     console.log(symbol);
//     try {
//       const res = await axios.post(`${URL}/api/v1/tsupdate/update`, { symbol });
//       toast.success("Updated");
//     } catch (error) {
//       console.error("Error updating data:", error);
//       toast.error(error.response.data);
//     }
//   };

//   const pendingData = data.filter((row) => row.update_status === "pending");
//   const completedData = data.filter((row) => row.update_status === "Completed");

//   return (
//     <section className="container px-4 mx-auto">
//       <div className="flex flex-col items-center justify-center gap-x-3 mt-5">
//         <h1 className="text-lg font-medium text-gray-800">
//           GET Compliance Data & Push to Typesense
//         </h1>
//       </div>

//       <div className="flex gap-8 mt-6">
//         {/* <div className="w-8/12">
//           <h2 className="text-gray-800 mb-4">
//             Pending Updates ({pendingData.length})
//           </h2>
//           <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//             <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
//               <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                   <thead className="bg-gray-50 dark:bg-gray-800">
//                     <tr>
//                       <th
//                         scope="col"
//                         className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
//                       >
//                         ID
//                       </th>
//                       <th
//                         scope="col"
//                         className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
//                       >
//                         Main Stock Name
//                       </th>
//                       <th
//                         scope="col"
//                         className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
//                       >
//                         Main Status
//                       </th>
//                       <th
//                         scope="col"
//                         className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
//                       >
//                         Secondary Status
//                       </th>
//                       <th
//                         scope="col"
//                         className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
//                       >
//                         Update Status
//                       </th>
//                       <th
//                         scope="col"
//                         className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
//                       >
//                         Operation
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
//                     {pendingData.map((row) => (
//                       <tr key={row.id}>
//                         <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                           {row.id}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                           {row.main_stock_name}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                           {row.main_status}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                           {row.secondary_status}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-red-600 whitespace-nowrap">
//                           {row.update_status}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                           <div className="flex items-center gap-x-6">
//                             <button
//                               className="text-white bg-gray-700 rounded px-4 py-1"
//                               onClick={() => handleUpdate(row.main_stock_name)}
//                             >
//                               Update
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div> */}

//         {/* Second table for completed updates - 30% width */}
//         {/* <div className="w-3/12">
//           <h2 className="text-gray-800 mb-4">
//             Pushed to typesense ({completedData.length})
//           </h2>
//           <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//             <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
//               <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
//                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                   <thead className="bg-gray-50 dark:bg-gray-800">
//                     <tr>
//                       <th
//                         scope="col"
//                         className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
//                       >
//                         ID
//                       </th>
//                       <th
//                         scope="col"
//                         className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
//                       >
//                         Main Stock Name
//                       </th>
//                       <th
//                         scope="col"
//                         className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
//                       >
//                         Update Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
//                     {completedData
//                       .slice()
//                       .reverse()
//                       .map((row) => (
//                         <tr key={row.id}>
//                           <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                             {row.id}
//                           </td>
//                           <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                             {row.main_stock_name}
//                           </td>
//                           <td className="px-4 py-4 text-sm text-green-600 whitespace-nowrap">
//                             {row.update_status}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div> */}
//       </div>
//     </section>
//   );
// };

// export default Update_TypesenseCM;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../App";
import toast from "react-hot-toast";

const Update_TypesenseCM = () => {
  const [data, setData] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUpdatedRecords = async () => {
      try {
        const res = await axios.get(`${URL}/api/v1/tsupdate/getUpdatedrecords`);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch records");
      }
    };

    getUpdatedRecords();
  }, []); // Empty dependency array to fetch data only on component mount

  const handleUpdate = async () => {
    if (!symbol) {
      setError("Enter Symbol to search");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${URL}/api/v1/tsupdate/update`, { symbol });
      console.log(res);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Box for Input Form */}
      <div className="shadow-lg rounded-lg p-8 max-w-6xl w-full bg-gray-900 mb-6">
        <h1 className="text-2xl font-semibold text-gray-200 mb-4 text-center">
          Update Symbol
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
            onClick={handleUpdate}
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="text-center text-red-400 mb-4">{error}</div>}
      </div>

      {/* Box for Table */}
      <div className="shadow-lg rounded-lg p-8 max-w-6xl w-full bg-gray-900">
        <h1 className="text-2xl font-semibold text-gray-200 mb-4 text-center">
          Updated Records
        </h1>
        <table className="min-w-full bg-gray-800 text-gray-300">
          <thead className="bg-gray-800">
            <tr className="bg-gray-600">
              <th className="p-2 border border-gray-700 text-gray-300">Id</th>
              <th className="p-2 border border-gray-700 text-gray-300">
                Typesense Id
              </th>
              <th className="p-2 border border-gray-700 text-gray-300">ISIN</th>
              <th className="p-2 border border-gray-700 text-gray-300">
                Stock Name
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 text-gray-300">
            {data
              .slice()
              .reverse()
              .map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border border-gray-700">{item.id}</td>
                  <td className="p-2 border border-gray-700">
                    {item.typesense_id}
                  </td>
                  <td className="p-2 border border-gray-700">{item.isin}</td>
                  <td className="p-2 border border-gray-700">
                    {item.stock_name}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Update_TypesenseCM;
