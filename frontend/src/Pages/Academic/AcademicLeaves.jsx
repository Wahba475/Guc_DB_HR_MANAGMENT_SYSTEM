import React, { useEffect, useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { Clock, CheckCircle, XCircle } from "lucide-react";

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

      setLeaves(res.data.data);
    } catch (err) {
      setError("Failed to load leaves.");
      console.log(err);
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Approved")
      return <CheckCircle className="text-emerald-600 w-5 h-5" />;
    if (status === "Rejected")
      return <XCircle className="text-red-600 w-5 h-5" />;
    return <Clock className="text-yellow-500 w-5 h-5" />;
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      {/* Center content vertically & horizontally */}
      <div className="flex flex-col items-center justify-center p-10">

        <h1 className="text-3xl font-bold mb-8 text-emerald-800">
          My Submitted Leaves 🍃
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* No records */}
        {leaves.length === 0 && !error && (
          <p className="text-gray-600 text-lg">No leaves found for this month.</p>
        )}

        {/* Table */}
        {leaves.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="pb-3">Request ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.request_ID} className="border-b last:border-none">
                    <td className="py-3">{leave.request_ID}</td>
                    <td>{leave.date_of_request.split("T")[0]}</td>
                    <td className="text-center flex justify-center py-2">
                      {getStatusIcon(leave.final_approval_status)}
                      <span className="ml-2 capitalize">
                        {leave.final_approval_status}
                      </span>
                    </td>
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
