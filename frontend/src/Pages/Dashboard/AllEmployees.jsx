import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";

export default function AllEmployees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/admin/employees",
        config
      );
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.first_name + " " + emp.last_name)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        emp.dept_name?.toLowerCase().includes(search.toLowerCase())

  );

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">All Employees</h1>

        {/* SEARCH */}
        <div className="mb-6 flex justify-between">
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-72 focus:outline-black"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Department</th>
                <th className="p-3">Employment Status</th>
                <th className="p-3">Salary</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.employee_id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{emp.employee_id}</td>
                  <td className="p-3">
                    {emp.first_name} {emp.last_name}
                  </td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.dept_name}</td>

                  <td className="p-3">{emp.employment_status}</td>
                  <td className="p-3">{emp.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEmployees.length === 0 && (
            <p className="p-4 text-center text-gray-500">No employees found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
