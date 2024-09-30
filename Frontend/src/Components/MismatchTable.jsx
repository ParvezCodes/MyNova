import React from "react";

const MismatchTable = ({ mismatches }) => {
  const exportToCSV = () => {
    // Create CSV headers
    const headers = [
      "Main ticker",
      "Stock Name",
      "ISIN",
      "Field",
      "DB Value",
      "TS Value",
    ];

    // Prepare CSV rows
    const rows = mismatches.flatMap((mismatch) =>
      mismatch.mismatches.map((detail) => [
        mismatch.stock_name,
        mismatch.isin,
        detail.field,
        detail.dbValue,
        detail.tsValue,
      ])
    );

    // Convert to CSV string
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    // Create a blob from the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a link element to download the file
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "mismatches.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between mb-4">
        <button
          onClick={exportToCSV}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to CSV
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr className="bg-gray-700">
            <th className="p-2 border border-gray-700 text-gray-300">
             Main Ticker
            </th>
            <th className="p-2 border border-gray-700 text-gray-300">
              SubTicker
            </th>
            <th className="p-2 border border-gray-700 text-gray-300">ISIN</th>
            <th className="p-2 border border-gray-700 text-gray-300">Field</th>
            <th className="p-2 border border-gray-700 text-gray-300">
              Nova Prod
            </th>
            <th className="p-2 border border-gray-700 text-gray-300">
              Compliance Collection 2
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 text-gray-300">
          {mismatches.map((mismatch, index) =>
            mismatch.mismatches.map((detail, idx) => (
              <tr key={`${index}-${idx}`} className="border-b border-gray-300">
                {idx === 0 && (
                  <>
                    <td
                      className="p-2 border border-gray-700"
                      rowSpan={mismatch.mismatches.length}
                    >
                      {mismatch.main_ticker}
                    </td>
                    <td
                      className="p-2 border border-gray-700"
                      rowSpan={mismatch.mismatches.length}
                    >
                      {mismatch.stock_name}
                    </td>
                    <td
                      className="p-2 border border-gray-700"
                      rowSpan={mismatch.mismatches.length}
                    >
                      {mismatch.isin}
                    </td>
                  </>
                )}
                <td className="p-2 border border-gray-700 text-blue-500">
                  {detail.field}
                </td>
                <td className="p-2 border border-gray-700 text-yellow-500">
                  {detail.dbValue}
                </td>
                <td className="p-2 border border-gray-700 text-green-500">
                  {detail.tsValue}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MismatchTable;
