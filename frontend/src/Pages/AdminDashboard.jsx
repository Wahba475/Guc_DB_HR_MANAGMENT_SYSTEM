import React, { useState, useEffect } from "react";
import Sidebar from "../Components/SideBar";
import axios from "axios";
// Import Lucide icons
import { Users, Building, XCircle, CalendarDays } from "lucide-react";

export default function AdminDashboard() {

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [departments, setDepartments] = useState(0);
  const [rejectedLeaves, setRejectedLeaves] = useState(0);
  const [holidays, setHolidays] = useState(0);

  // Centralizing the token retrieval and header configuration
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Execute all API calls concurrently for better performance
      const [empRes, deptRes, rejectedRes, holidaysRes] = await Promise.all([
        axios.get("http://localhost:3000/admin/employees", config),
        axios.get("http://localhost:3000/admin/employees/count", config), // Assuming this endpoint returns an array of departments/groups
        axios.get("http://localhost:3000/admin/rejected/medical", config), // Assuming this endpoint returns an array of rejected leaves
        axios.get("http://localhost:3000/admin/holidays/count", config), // Assuming this endpoint returns an object with a 'count' property
      ]);

      // State updates based on concurrent results
      setTotalEmployees(empRes.data.length);
      setDepartments(deptRes.data.length);
      setRejectedLeaves(rejectedRes.data.length);
      setHolidays(holidaysRes.data.count);

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      // Consider adding user-facing error handling here (e.g., set an error state)
    }
  };
  
  // Define an array of card data to simplify rendering and apply consistent styling
  const summaryCards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Departments",
      value: departments,
      icon: Building,
      color: "text-green-600",
    },
    {
      title: "Rejected Leaves",
      value: rejectedLeaves,
      icon: XCircle,
      color: "text-red-600",
    },
    {
      title: "Holidays",
      value: holidays,
      icon: CalendarDays,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <Sidebar />

      <div className="p-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard 📊</h1>

        {/* Summary Cards with Hover Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {summaryCards.map((card) => (
            <div
              key={card.title}
              // The new magic: smooth transition, lift on hover, and enhanced shadow
              className="p-6 bg-white shadow-md rounded-xl text-center flex flex-col items-center 
                         transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              {/* Icon and Title */}
              <div className={`flex items-center space-x-3 mb-3 ${card.color}`}>
                <card.icon className="w-8 h-8" /> 
                <h2 className="text-lg font-semibold text-gray-700">{card.title}</h2>
              </div>
              
              {/* Value */}
              <p className="text-4xl font-extrabold mt-2 text-gray-900">{card.value}</p>
            </div>
          ))}

        </div>

        {/* You can add more dashboard content here */}

      </div>
    </div>
  );
}