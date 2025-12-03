import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { toast } from "react-hot-toast";

// ⭐ Helper function to format SQL TIME fields
// NOTE: SQL returns TIME as a full ISO datetime (1970-01-01T09:00:00Z)
// We extract only "HH:MM"
const formatTime = (value) => {
  if (!value) return "—";
  return value.substring(11, 16); // Extracts HH:MM
};

export default function YesterdayAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    fetchYesterdayAttendance();
  }, []);

  const fetchYesterdayAttendance = async () => {
    try {
      toast.loading("Fetching yesterday’s attendance...");

      const res = await axios.get(
        "http://localhost:3000/admin/attendance/yesterday",
        config
      );

      setRecords(res.data.data || []);
      toast.dismiss();
      toast.success("Attendance loaded successfully!");
    } catch (err) {
      console.error("Error fetching yesterday attendance:", err);
      toast.dismiss();
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Yesterday Attendance</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No attendance records for yesterday.
          </p>
        ) : (
          <div className="bg-white shadow rounded">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Check In</th>
                  <th className="p-3">Check Out</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {records.map((att) => (
                  <tr key={att.attendance_ID} className="border-b hover:bg-gray-50">
                    <td className="p-3">{att.attendance_ID}</td>
                    <td className="p-3">{att.emp_ID}</td>
                    <td className="p-3">{att.date?.slice(0, 10)}</td>

                    {/* ⭐ TIME FIX APPLIED HERE */}
                    <td className="p-3">{formatTime(att.check_in_time)}</td>
                    <td className="p-3">{formatTime(att.check_out_time)}</td>

                    <td className="p-3">{att.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
