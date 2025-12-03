import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";

export default function EmployeesPerDepartment() {
  const [departments, setDepartments] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/admin/employees/count",
        config
      );
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Employees Per Department</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dpt, idx) => (
            <div
              key={idx}
              className="p-6 bg-white shadow rounded text-center border"
            >
              <h2 className="text-xl font-semibold">{dpt["Department"]}</h2>
              <p className="text-4xl mt-2 font-bold">
                {dpt["Number of Employees"]}
              </p>
            </div>
          ))}
        </div>

        {departments.length === 0 && (
          <p className="text-gray-500 mt-10 text-center">No data found.</p>
        )}
      </div>
    </div>
  );
}
