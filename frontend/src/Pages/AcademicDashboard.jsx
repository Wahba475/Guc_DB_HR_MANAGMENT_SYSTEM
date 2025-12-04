import React, { useState, useEffect } from "react";
import AcademicSidebar from "../Components/AcademicSideBar";
import axios from "axios";

// Lucide icons
import {
  BarChart3,
  CalendarCheck,
  FileText,
  DollarSign,
  Scissors,
} from "lucide-react";

export default function AcademicDashboard() {
  const [performanceCount, setPerformanceCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [leavesCount, setLeavesCount] = useState(0);
  const [payrollAmount, setPayrollAmount] = useState(0);   // ✅ FIXED
  const [deductionsCount, setDeductionsCount] = useState(0);

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("academicToken")}`,
    },
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        perfRes,
        attRes,
        leavesRes,
        payrollRes,
        deductionsRes,
      ] = await Promise.all([
        axios.get("http://localhost:3000/academic/performance/W23", config),
        axios.get("http://localhost:3000/academic/attendance", config),
        axios.get("http://localhost:3000/academic/leaves", config),
        axios.get("http://localhost:3000/academic/payroll", config),
        axios.get("http://localhost:3000/academic/deductions/12", config),
      ]);

      setPerformanceCount(perfRes.data.data.length);
      setAttendanceCount(attRes.data.data.length);
      setLeavesCount(leavesRes.data.data.length);

      // ✅ FIXED PAYROLL AMOUNT
      if (payrollRes.data.data.length > 0) {
        setPayrollAmount(payrollRes.data.data[0].final_salary_amount);
      } else {
        setPayrollAmount(0);
      }

      setDeductionsCount(deductionsRes.data.data.length);

    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    }
  };

  const summaryCards = [
    {
      title: "Performance Records",
      value: performanceCount,
      icon: BarChart3,
      color: "text-emerald-600",
    },
    {
      title: "Attendance (This Month)",
      value: attendanceCount,
      icon: CalendarCheck,
      color: "text-blue-600",
    },
    {
      title: "My Leaves",
      value: leavesCount,
      icon: FileText,
      color: "text-yellow-600",
    },
    {
      title: "Last Month Payroll",
      value: payrollAmount + " EGP", // ✅ NOW SHOWS SALARY, NOT COUNT
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "My Deductions",
      value: deductionsCount,
      icon: Scissors,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="p-10">
        <h1 className="text-3xl font-bold mb-8 text-emerald-800 flex items-center gap-2">
          Academic Dashboard 🎓
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="p-6 bg-white shadow-md rounded-xl text-center flex flex-col items-center 
                         transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              <div className={`flex items-center space-x-3 mb-3 ${card.color}`}>
                <card.icon className="w-8 h-8" />
                <h2 className="text-lg font-semibold text-gray-700">
                  {card.title}
                </h2>
              </div>

              <p className="text-4xl font-extrabold mt-2 text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
