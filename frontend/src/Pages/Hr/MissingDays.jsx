import React, { useState } from "react";
import axios from "axios";
import HRSidebar from "../../Components/HRSidebar";
import { toast, ToastContainer } from "react-toastify";

export default function MissingDays() {
  const [empId, setEmpId] = useState("");

  const applyDeduction = async (e) => {
    e.preventDefault();

    if (!empId) return toast.error("Please enter an Employee ID");

    try {
      const token = localStorage.getItem("hrToken");

      await axios.post(
        `http://localhost:3000/HR/deduct/missing-days/${empId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Missing-days deduction applied for Employee #${empId}`);
    } catch (e) {
      toast.error("Failed to apply deduction");
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <HRSidebar />

      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">
          Missing Days Deduction
        </h1>

        <form
          onSubmit={applyDeduction}
          className="bg-white shadow rounded-lg p-6 max-w-lg"
        >
          <p className="text-gray-600 mb-4">
            This will calculate missing <span className="font-semibold">days</span> for the employee
            this month and insert a <span className="font-semibold">pending</span> deduction.
          </p>

          <label className="block text-sm font-medium mb-1">Employee ID</label>
          <input
            type="number"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            placeholder="Enter employee ID"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4
                       focus:outline-none focus:border-blue-600"
          />

          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded bg-blue-600 text-white
                       hover:bg-blue-700 transition"
          >
            Apply Missing Days Deduction
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
