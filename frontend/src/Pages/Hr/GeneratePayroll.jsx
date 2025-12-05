import React, { useState } from "react";
import axios from "axios";
import HRSidebar from "../../Components/HRSidebar";
import { toast, ToastContainer } from "react-toastify";

export default function GeneratePayroll() {
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!employeeId) return toast.error("Please enter an Employee ID");
    if (!month) return toast.error("Please select a month");

    try {
      const token = localStorage.getItem("hrToken");

      await axios.post(
        "http://localhost:3000/HR/payroll/generate",
        { employeeId, month },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `Payroll generated successfully for Employee #${employeeId}`
      );

      setEmployeeId("");
      setMonth("");
    } catch (err) {
      toast.error("Failed to generate payroll");
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <HRSidebar />

      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">
          Generate Monthly Payroll
        </h1>

        <form
          onSubmit={handleGenerate}
          className="bg-white shadow rounded-lg p-6 max-w-lg"
        >
          <p className="text-gray-600 mb-4">
            This will calculate and generate payroll for the selected employee
            for the chosen <span className="font-semibold">month</span>.
          </p>

          {/* Employee ID */}
          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <input
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter Employee ID"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4
                       focus:outline-none focus:border-blue-600"
          />

          {/* Month Selector */}
          <label className="block text-sm font-medium mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4
                       focus:outline-none focus:border-blue-600"
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} — {new Date(0, i).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white
                       hover:bg-blue-700 transition w-full"
          >
            Generate Payroll
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
