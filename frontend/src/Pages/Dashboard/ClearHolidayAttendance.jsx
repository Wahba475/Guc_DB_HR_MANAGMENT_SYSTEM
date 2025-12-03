import React from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClearHolidayAttendance() {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const handleClear = async () => {
    try {
      toast.loading("Removing holiday attendance...");

      const res = await axios.delete(
        "http://localhost:3000/admin/remove/holiday/attendance",
        config
      );

      toast.dismiss();
      toast.success(res.data.message || "Holiday attendance removed.");
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to remove holiday attendance."
      );
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      {/* CONTENT */}
      <div className="flex flex-col items-center justify-center p-10 overflow-auto">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Clear Holiday Attendance
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl text-center">

          <p className="mb-4 text-gray-700">
            This action will <b>delete all attendance records</b> that fall inside any
            official holiday range in the <span className="font-semibold">Holiday</span> table.
          </p>

          <p className="mb-6 text-red-600 font-semibold">
            ⚠ This action is permanent and cannot be undone.
          </p>

          <button
            onClick={handleClear}
            className="bg-black w-full py-3 rounded-lg text-white text-lg hover:bg-gray-900 transition"
          >
            Remove Holiday Attendance
          </button>
        </div>

        {/* Toasts */}
        <ToastContainer position="top-right" autoClose={1800} />
      </div>
    </div>
  );
}
