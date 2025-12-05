// Frontend/src/Pages/Hr/UnpaidLeaves.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import HRSidebar from "../../Components/HRSidebar";
import { ToastContainer, toast } from "react-toastify";

export default function UnpaidLeaves() {
  const [leaves, setLeaves] = useState([]);

  const getToken = () => localStorage.getItem("hrToken");

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const fetchLeaves = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Session expired, please log in again.");
        return;
      }

      const res = await axios.get(
        "http://localhost:3000/HR/leaves/unpaid",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeaves(res.data.data || []);
    } catch (err) {
      console.error("Fetch unpaid leaves error:", err);
      toast.error("Failed to load unpaid leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:3000/HR/leaves/unpaid/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Unpaid leave processed");
      fetchLeaves();
    } catch (err) {
      console.error("Approve unpaid error:", err);
      toast.error("Unpaid approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:3000/HR/leaves/unpaid/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.error("Unpaid leave rejected");
      fetchLeaves();
    } catch (err) {
      console.error("Reject unpaid error:", err);
      toast.error("Unpaid rejection failed");
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
                <td className="p-3">
                  {l.first_name} {l.last_name}
                </td>

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

            {leaves.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-gray-500 text-center">
                  No pending unpaid leave requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <ToastContainer />
      </div>
    </div>
  );
}
