import React from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function UpdateAllEmployment() {
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const handleUpdate = async () => {
    try {
      toast.loading("Updating all employees...");

      const res = await axios.put(
        "http://localhost:3000/admin/update/employment-status/all",
        {},
        config
      );

      toast.dismiss();
      toast.success(res.data.message);
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Failed to update all.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-3xl font-bold mb-8">Update All Employment Statuses</h1>

        <div className="bg-white p-8 shadow-lg rounded-xl max-w-lg w-full text-center">
          <p className="mb-6 text-gray-700">
            This will update employment status for <b>every employee</b> in the system.
          </p>

          <button
            onClick={handleUpdate}
            className="bg-black text-white w-full py-3 rounded-lg hover:bg-gray-900"
          >
            Update All Employees
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={1800} />
      </div>
    </div>
  );
}
