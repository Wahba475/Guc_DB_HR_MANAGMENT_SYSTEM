import React, { useEffect, useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function UnpaidApprovalPage() {
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("academicToken");

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/academic/leaves/unpaid/pending",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequests(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load pending unpaid leaves.");
    }
  };

  const handleAction = async (request_ID, action) => {
    try {
      await axios.post(
        "http://localhost:3000/academic/leaves/unpaid/review",
        { request_ID, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Correct success messages
      const messages = {
        approve: "Leave approved successfully.",
        reject: "Leave rejected successfully.",
      };

      toast.success(messages[action]);
      fetchPending();

    } catch (err) {
      console.log(err);
      toast.error("Action failed.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6 text-emerald-800">
          Pending Unpaid Leave Approvals
        </h1>

        {requests.length === 0 ? (
          <p className="text-gray-600 mt-10">No pending unpaid leaves.</p>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md max-w-4xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="pb-3">Request ID</th>
                  <th className="pb-3">Employee</th>
                  <th className="pb-3">From</th>
                  <th className="pb-3">To</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((r) => (
                  <tr key={r.request_ID} className="border-b">
                    <td>{r.request_ID}</td>
                    <td>{r.employee_name}</td>
                    <td>{r.start_date?.split("T")[0]}</td>
                    <td>{r.end_date?.split("T")[0]}</td>

                    <td className="flex justify-center gap-3 py-3">

                      {/* APPROVE BUTTON */}
                      <button
                        onClick={() => handleAction(r.request_ID, "approve")}
                        className="bg-emerald-600 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <Check size={16} />
                        Approve
                      </button>

                      {/* REJECT BUTTON */}
                      <button
                        onClick={() => handleAction(r.request_ID, "reject")}
                        className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                      >
                        <X size={16} />
                        Reject
                      </button>

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
