import React, { useEffect, useState } from "react";
import axios from "axios";
import HRSidebar from "../../Components/HRSidebar";
import { ToastContainer, toast } from "react-toastify";

export default function UnpaidLeavesHR() {
  const [leaves, setLeaves] = useState([]);

  const getToken = () => localStorage.getItem("hrToken");

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB") : "—";

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:3000/HR/leaves/unpaid", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      setLeaves(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch unpaid leaves");
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/HR/leaves/unpaid/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      toast.success("Unpaid Leave Approved");
      fetchLeaves();
    } catch {
      toast.error("Approval Failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/HR/leaves/unpaid/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      toast.error("Leave Rejected");
      fetchLeaves();
    } catch {
      toast.error("Rejection Failed");
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <HRSidebar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">
          Unpaid Leave Requests
        </h1>

        <table className="w-full bg-white shadow rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l.leave_id} className="border-b text-center">

                <td className="p-3">{l.first_name} {l.last_name}</td>

                <td className="p-3">
                  {formatDate(l.start_date)} → {formatDate(l.end_date)}
                </td>

                <td className="p-3">
                  {l.reason || "—"}
                </td>

                <td className="p-3 flex gap-3 justify-center">
                  <button
                    onClick={() => handleApprove(l.leave_id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(l.leave_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <ToastContainer />
      </div>
    </div>
  );
}
