import React, { useState } from "react";
import axios from "axios";
import HRSidebar from "../../Components/HRSidebar";
import { toast, ToastContainer } from "react-toastify";

export default function DeductUnpaid() {
  const [employeeId, setEmployeeId] = useState("");

  const handleDeduction = async (e) => {
    e.preventDefault();

    if (!employeeId) return toast.error("Please enter Employee ID");

    try {
      const token = localStorage.getItem("hrToken");

      await axios.post(
        "http://localhost:3000/hr/deduction/unpaid",
        { employeeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Unpaid leave deduction applied!");
    } catch (err) {
      toast.error("Error processing deduction");
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <HRSidebar />

      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">
          Deduct Unpaid Leave
        </h1>

        <form
          onSubmit={handleDeduction}
          className="bg-white shadow rounded-lg p-6 max-w-lg"
        >
          <p className="text-gray-600 mb-4">
            This will calculate unpaid leave deductions for the employee for the
            <span className="font-semibold"> current month</span>.
          </p>

          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <input
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter Employee ID"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4
                       focus:outline-none focus:border-blue-600"
          />

          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white
                       hover:bg-blue-700 transition"
          >
            Apply Unpaid Deduction
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
