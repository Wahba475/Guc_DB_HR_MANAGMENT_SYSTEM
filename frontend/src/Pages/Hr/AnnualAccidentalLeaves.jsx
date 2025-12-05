import React, { useEffect, useState } from "react";
import axios from "axios";
import HRSidebar from "../../Components/HRSidebar";
import { ToastContainer, toast } from "react-toastify";

export default function AnnualAccidentalLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const getToken = () => localStorage.getItem("hrToken");

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  const fetchLeaves = async () => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Session expired, please log in again.");
        return;
      }

      const res = await axios.get(
        "http://localhost:3000/HR/leaves/annual-accidental",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeaves(res.data.data);
    } catch (err) {
      toast.error("Failed to load leaves");
      console.error("Fetch error:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Session expired, please log in again.");
        return;
      }

      await axios.put(
        `http://localhost:3000/HR/leaves/annual-accidental/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Leave Approved Successfully");
      fetchLeaves();
    } catch (err) {
      toast.error("Approval Failed");
      console.error("Approve error:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        toast.error("Session expired, please log in again.");
        return;
      }

      await axios.put(
        `http://localhost:3000/HR/leaves/annual-accidental/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.error("Leave Rejected");
      fetchLeaves();
    } catch (err) {
      toast.error("Rejection Failed");
      console.error("Reject error:", err);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <HRSidebar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-semibold text-blue-600 mb-6">
          Annual & Accidental Leave Requests
        </h1>

        <table className="w-full bg-white shadow rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Type</th>
              <th className="p-3">Dates</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l.leave_id} className="border-b text-center">
                <td className="p-3">
                  {l.first_name} {l.last_name}
                </td>

                <td className="p-3 capitalize">{l.leave_type}</td>

                <td className="p-3">
                  {formatDate(l.start_date)} → {formatDate(l.end_date)}
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
