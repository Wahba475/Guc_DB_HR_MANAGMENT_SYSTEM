import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";

export default function RejectedMedicalLeaves() {
  const [leaves, setLeaves] = useState([]);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    fetchRejectedLeaves();
  }, []);

  const fetchRejectedLeaves = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/admin/rejected/medical",
        config
      );
      setLeaves(res.data);
    } catch (error) {
      console.error("Error fetching rejected medical leaves:", error);
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Rejected Medical Leaves</h1>

        <div className="bg-white shadow rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3">Request ID</th>
                <th className="p-3">Employee ID</th>
                <th className="p-3">Insurance Status</th>
                <th className="p-3">Disability Details</th>
                <th className="p-3">Type</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.request_ID} className="border-b hover:bg-gray-50">
                  <td className="p-3">{leave.request_ID}</td>
                  <td className="p-3">{leave.Emp_ID}</td>
                  <td className="p-3">
                    {leave.insurance_status === 1 ? "Covered" : "Not Covered"}
                  </td>
                  <td className="p-3">{leave.disability_details}</td>
                  <td className="p-3 capitalize">{leave.type}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {leaves.length === 0 && (
            <p className="p-4 text-center text-gray-500">
              No rejected medical leaves found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
