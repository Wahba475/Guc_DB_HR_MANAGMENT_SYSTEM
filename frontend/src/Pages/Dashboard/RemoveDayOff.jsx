import React, { useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RemoveDayOff() {
  const [employeeId, setEmployeeId] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      toast.error("Please enter an employee ID.");
      return;
    }

    try {
      toast.loading("Removing day-off attendance records...");

      const res = await axios.delete(
        `http://localhost:3000/admin/remove/EmployeeDayOff/${employeeId}`,
        { headers: config.headers }
      );
      

      toast.dismiss();
      toast.success(res.data.message || "Day-off records removed.");
      setEmployeeId("");
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
          "Failed to remove day-off records for this employee."
      );
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col items-center justify-center p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Remove Day-Off Records
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
          <p className="mb-4 text-gray-700">
            This will <b>delete attendance records</b> in the{" "}
            <b>current month</b> where the employee was marked absent
            on their <b>official day off</b>.
          </p>

          <p className="mb-4 text-sm text-gray-500">
            The system uses the employee&apos;s{" "}
            <span className="font-semibold">official_day_off</span> from the
            Employee table (e.g. Friday, Saturday).
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="text-left">
              <label className="block mb-1 text-sm font-medium">
                Employee ID
              </label>
              <input
                type="number"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-black"
                placeholder="Enter employee ID (e.g. 2)"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Remove Day-Off Attendance
            </button>
          </form>
        </div>

        <ToastContainer position="top-right" autoClose={1800} />
      </div>
    </div>
  );
}
