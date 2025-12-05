import React, { useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";

export default function AcademicDeductions() {
  const [month, setMonth] = useState("");
  const [deductions, setDeductions] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("academicToken");

  const fetchDeductions = async () => {
    if (!month) {
      setError("Please select a month.");
      return;
    }
    setError("");

    try {
      const res = await axios.get(
        `http://localhost:3000/academic/deductions/${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDeductions(res.data.data);
    } catch (err) {
      setError("Failed to load deductions.");
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />
      <div className="p-10 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6 text-emerald-800">
          My Deductions 💸
        </h1>

        {/* Month Selection */}
        <div className="mb-6 flex items-center gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select Month</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <button
            onClick={fetchDeductions}
            className="px-6 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition"
          >
            View
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Table */}
        {deductions.length > 0 && (
          <div className="bg-white p-6 shadow-md rounded-xl max-w-3xl">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3">Amount (EGP)</th>
                </tr>
              </thead>

              <tbody>
                {deductions.map((d) => (
                  <tr
                    key={d.deduction_ID}
                    className="border-b last:border-none hover:bg-gray-100 transition"
                  >
                    <td className="py-4 pr-6 text-gray-800">
                      {d.date?.split("T")[0]}
                    </td>

                    <td className="py-4 pr-6 text-gray-700 font-medium capitalize">
                      {d.reason || d.type}
                    </td>

                    <td className="py-4 text-emerald-700 font-semibold">
                      {Number(d.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {deductions.length === 0 && !error && (
          <p className="text-gray-600 mt-6">
            No deductions found for this month.
          </p>
        )}
      </div>
    </div>
  );
}
