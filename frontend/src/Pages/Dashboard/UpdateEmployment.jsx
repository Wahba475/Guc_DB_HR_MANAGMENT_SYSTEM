import React, { useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function UpdateEmployment() {
  const [employeeId, setEmployeeId] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      toast.error("Employee ID is required.");
      return;
    }

    try {
      toast.loading("Updating employment status...");

      const res = await axios.put(
        "http://localhost:3000/admin/update/employment-status",
        { employeeId: Number(employeeId) },
        config
      );

      toast.dismiss();
      toast.success(res.data.message);
      setEmployeeId("");
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Update failed.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-bold mb-8">Update Employment Status</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg p-8 rounded-xl w-full max-w-lg"
        >
          <label className="font-medium">Employee ID</label>
          <input
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full border rounded px-4 py-2 mt-2"
            placeholder="Enter Employee ID"
          />

          <button
            type="submit"
            className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-900"
          >
            Update Status
          </button>
        </form>

        <ToastContainer position="top-right" autoClose={1800} />
      </div>
    </div>
  );
}
