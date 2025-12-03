import React, { useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddHoliday() {
  const [holidayName, setHolidayName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [holidays, setHolidays] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/admin/add/holiday",
        { holidayName, fromDate, toDate },
        config
      );

      toast.success(res.data.message || "Holiday added!", {
        autoClose: 2000,
      });

      setHolidays(res.data.holidays); // update table

      // Clear inputs
      setHolidayName("");
      setFromDate("");
      setToDate("");

    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding holiday");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Add Official Holiday</h1>

        {/* FORM */}
        <div className="bg-white shadow-lg rounded p-6 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium">Holiday Name</label>
              <input
                type="text"
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
                placeholder="e.g. Christmas"
                className="border w-full px-4 py-2 rounded mt-1 focus:outline-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border w-full px-4 py-2 rounded mt-1 focus:outline-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border w-full px-4 py-2 rounded mt-1 focus:outline-black"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-900 transition-all"
            >
              Add Holiday
            </button>
          </form>
        </div>

        {/* HOLIDAY TABLE */}
        {holidays.length > 0 && (
          <div className="mt-10 bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Holiday Table</h2>

            <table className="w-full border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">From</th>
                  <th className="p-2">To</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h) => (
                  <tr key={h.holiday_ID} className="border-b">
                    <td className="p-2">{h.holiday_ID}</td>
                    <td className="p-2">{h.holiday_name}</td>
                    <td className="p-2">{h.from_date?.slice(0, 10)}</td>
                    <td className="p-2">{h.to_date?.slice(0, 10)}</td>
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
