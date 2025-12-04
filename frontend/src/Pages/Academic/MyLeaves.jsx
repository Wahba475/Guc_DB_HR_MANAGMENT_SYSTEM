import React, { useEffect, useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { CalendarDays } from "lucide-react";

export default function AcademicLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("academicToken");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:3000/academic/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeaves(res.data.data); // RECORDSET FROM BACKEND
    } catch (err) {
      console.log(err);
      setError("Failed to fetch leave requests.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="p-10 flex flex-col items-center">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 text-emerald-800 flex items-center gap-2">
          <CalendarDays className="w-7 h-7 text-emerald-700" />
          My Leave Requests
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* NO LEAVES */}
        {leaves.length === 0 && (
          <p className="text-gray-600 mt-10">📭 No leave requests found.</p>
        )}

        {/* LEAVE TABLE */}
        {leaves.length > 0 && (
          <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-6">

            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="pb-3">Request ID</th>
                  <th className="pb-3">Request Date</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((row) => {
                  const date = row.date_of_request?.split("T")[0];

                  return (
                    <tr key={row.request_ID} className="border-b last:border-none">
                      <td className="py-3">{row.request_ID}</td>
                      <td>{date}</td>

                      <td className="text-center">
                        {row.final_approval_status === "Approved" ? (
                          <span className="text-green-600 font-semibold">
                            Approved
                          </span>
                        ) : row.final_approval_status === "Rejected" ? (
                          <span className="text-red-600 font-semibold">
                            Rejected
                          </span>
                        ) : (
                          <span className="text-yellow-500 font-semibold">
                            Pending
                          </span>
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
