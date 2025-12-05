import React, { useState } from "react";
import axios from "axios";
import HRSidebar from "../../Components/HRSidebar";
import { ToastContainer, toast } from "react-toastify";

export default function MissingHoursDeduction() {
  const [empId, setEmpId] = useState("");

  const getToken = () => localStorage.getItem("hrToken");

  const handleApply = async (e) => {
    e.preventDefault();

    if (!empId) {
      toast.error("Please enter an Employee ID");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      await axios.post(
        `http://localhost:3000/HR/deductions/missing-hours/${empId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `Missing-hours deduction calculated for Employee #${empId}`
      );
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Failed to apply missing-hours deduction.";
      toast.error(msg);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <HRSidebar />

      <div className="flex-1 flex flex-col items-center justify-center p-10 overflow-auto">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">
          Missing Hours Deduction
        </h1>

        <form
          onSubmit={handleApply}
          className="bg-white shadow rounded-lg p-6 max-w-lg"
        >
          <p className="text-gray-600 mb-4">
            This will calculate the missing working hours for the selected employee
            for the <span className="font-semibold">current month</span> and
            insert a <span className="font-semibold">pending</span> deduction
            into the system.
          </p>

          <label className="block text-sm font-medium mb-1">
            Employee ID
          </label>
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
            Apply Missing Hours Deduction
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
}
