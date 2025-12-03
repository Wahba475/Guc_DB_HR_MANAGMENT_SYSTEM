import React, { useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ⭐ FORMATTERS
const formatTime = (value) => {
  if (!value) return "—";
  return value.substring(11, 16);
};

const formatDate = (value) => {
  if (!value) return "—";
  return value.substring(0, 10);
};

export default function InitializeAttendance() {
  const [rows, setRows] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const handleInit = async () => {
    try {
      toast.loading("Initializing attendance...");

      const res = await axios.post(
        "http://localhost:3000/admin/initiate/attendance",
        {},
        config
      );

      toast.dismiss();
      toast.success(res.data.message || "Done!");

      setRows(res.data.rows);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Initialize Today’s Attendance
        </h1>

        <div className="bg-white shadow p-6 rounded-lg max-w-xl mx-auto text-center">
          <p className="mb-4">
            This will generate attendance rows for all employees.
          </p>

          <button
            onClick={handleInit}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-900"
          >
            Initialize Attendance
          </button>
        </div>

        {rows.length > 0 && (
          <div className="mt-10 bg-white shadow rounded p-6">
            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Employee</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Check-In</th>
                  <th className="p-2">Check-Out</th>
                  <th className="p-2">Duration</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.attendance_ID} className="border-b">
                    <td className="p-2">{r.attendance_ID}</td>
                    <td className="p-2">{r.emp_ID}</td>

                    {/* ⭐ FIXED HERE */}
                    <td className="p-2">{formatDate(r.date)}</td>
                    <td className="p-2">{formatTime(r.check_in_time)}</td>
                    <td className="p-2">{formatTime(r.check_out_time)}</td>
                    <td className="p-2">{r.total_duration || "—"}</td>

                    <td className="p-2">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
