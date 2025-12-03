import React, { useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RemoveDeductions() {
  const [resignedEmployees, setResignedEmployees] = useState([]);
  const [deductions, setDeductions] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const handleRemove = async () => {
    try {
      const res = await axios.delete(
        "http://localhost:3000/admin/remove/resigned/deductions",
        config
      );

      toast.success(res.data.message || "Done!", { autoClose: 2000 });

      setResignedEmployees(res.data.resignedEmployees || []);
      setDeductions(res.data.deductions || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred", {
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Remove Deductions for Resigned Employees
        </h1>

        {/* ACTION CARD */}
        <div className="bg-white shadow p-6 rounded-lg max-w-xl mx-auto text-center">
          <p className="mb-4 text-gray-700">
            This will remove all deductions for employees whose status is{" "}
            <b>resigned</b>.
          </p>

          <button
            onClick={handleRemove}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-900 transition-all"
          >
            Remove Deductions
          </button>
        </div>

        {/* RESIGNED EMPLOYEES */}
        {resignedEmployees.length > 0 && (
          <div className="mt-10 bg-white shadow rounded p-6">
            <h2 className="text-xl font-bold mb-4">Resigned Employees</h2>

            <table className="w-full border text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Employee ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {resignedEmployees.map((emp) => (
                  <tr key={emp.employee_id} className="border-b">
                    <td className="p-2">{emp.employee_id}</td>
                    <td className="p-2">
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td className="p-2">{emp.employment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* UPDATED DEDUCTIONS TABLE */}
        {deductions.length > 0 && (
          <div className="mt-10 bg-white shadow rounded p-6">
            <h2 className="text-xl font-bold mb-4">Updated Deductions</h2>

            <table className="w-full border text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2">Deduction ID</th>
                  <th className="p-2">Employee ID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Unpaid ID</th>
                  <th className="p-2">Attendance ID</th>
                </tr>
              </thead>
              <tbody>
                {deductions.map((d) => (
                  <tr key={d.deduction_ID} className="border-b">
                    <td className="p-2">{d.deduction_ID}</td>
                    <td className="p-2">{d.emp_ID}</td>
                    <td className="p-2">{d.amount}</td>
                    <td className="p-2">{d.type}</td>
                    <td className="p-2">{d.status}</td>
                    <td className="p-2">{d.date}</td>
                    <td className="p-2">{d.unpaid_ID}</td>
                    <td className="p-2">{d.attendance_ID}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}
