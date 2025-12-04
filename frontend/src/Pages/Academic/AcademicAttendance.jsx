import React, { useEffect, useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { CalendarCheck, CalendarX, CalendarDays } from "lucide-react";

export default function AcademicAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("academicToken");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:3000/academic/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAttendance(res.data.data);
    } catch (err) {
      setError("Failed to fetch attendance.");
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="p-10 flex flex-col items-center">
        {/* Title with nicer icon instead of emoji */}
        <h1 className="text-3xl font-bold mb-6 text-emerald-800 flex items-center gap-2">
          My Attendance — Current Month
          <CalendarDays className="w-7 h-7 text-emerald-700" />
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* NO RECORDS */}
        {attendance.length === 0 && (
          <p className="text-gray-600 mt-10">📭 No attendance records found.</p>
        )}

        {/* ATTENDANCE TABLE */}
        {attendance.length > 0 && (
          <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-6">
            <table className="w-full text-left">
              {/* ---------- TABLE HEADER ---------- */}
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Check In</th>
                  <th className="pb-3">Check Out</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>

              {/* ---------- TABLE BODY ---------- */}
              <tbody>
                {attendance.map((row) => {
                  // date is something like "2025-12-03T00:00:00.000Z"
                  const date = row.date?.split("T")[0];

                  // check_in_time / check_out_time are full datetimes → format them
                  const checkIn = row.check_in_time
                    ? new Date(row.check_in_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--";

                  const checkOut = row.check_out_time
                    ? new Date(row.check_out_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--";

                  const duration = row.total_duration
                    ? `${Math.floor(row.total_duration / 60)}h ${
                        row.total_duration % 60
                      }m`
                    : "--";

                  return (
                    <tr
                      key={row.attendance_ID}
                      className="border-b last:border-none"
                    >
                      <td className="py-3">{date}</td>
                      <td>{checkIn}</td>
                      <td>{checkOut}</td>
                      <td>{duration}</td>

                      {/* Status icon, perfectly centered */}
                      <td className="py-3 text-center">
                        {row.status === "Attended" ? (
                          <CalendarCheck className="w-6 h-6 text-emerald-600 mx-auto" />
                        ) : (
                          <CalendarX className="w-6 h-6 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
