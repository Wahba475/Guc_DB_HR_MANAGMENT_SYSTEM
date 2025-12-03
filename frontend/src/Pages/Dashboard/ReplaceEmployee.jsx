import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReplaceEmployee() {
  const [employees, setEmployees] = useState([]);
  const [emp1, setEmp1] = useState("");
  const [emp2, setEmp2] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/employees", config);
      setEmployees(res.data || []);
    } catch (error) {
      toast.error("Failed to load employees.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emp1 || !emp2 || !fromDate || !toDate) {
      toast.error("Please fill all fields.");
      return;
    }

    if (emp1 === emp2) {
      toast.error("Employee and replacement cannot be the same.");
      return;
    }

    try {
      toast.loading("Saving replacement...");

      const res = await axios.post(
        "http://localhost:3000/admin/employee/replace",
        {
          emp1: Number(emp1),
          emp2: Number(emp2),
          fromDate,
          toDate,
        },
        config
      );

      toast.dismiss();
      toast.success(res.data.message || "Replacement saved.");
      setEmp1("");
      setEmp2("");
      setFromDate("");
      setToDate("");
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to save replacement."
      );
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col items-center justify-center p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Assign Replacement Employee
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
          <p className="mb-4 text-gray-700">
            Use this form to assign a <b>replacement employee</b> for a specific
            period. This is used when an employee is on leave and someone else
            should act in their place.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Employee being replaced */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Employee to be Replaced (Emp1)
              </label>
              <select
                value={emp1}
                onChange={(e) => setEmp1(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-black"
              >
                <option value="">-- select employee --</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.first_name} {emp.last_name} (ID: {emp.employee_id})
                  </option>
                ))}
              </select>
            </div>

            {/* Replacement employee */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Replacement Employee (Emp2)
              </label>
              <select
                value={emp2}
                onChange={(e) => setEmp2(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-black"
              >
                <option value="">-- select replacement --</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.first_name} {emp.last_name} (ID: {emp.employee_id})
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-black"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-black"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Save Replacement
            </button>
          </form>
        </div>

        <ToastContainer position="top-right" autoClose={1800} />
      </div>
    </div>
  );
}
