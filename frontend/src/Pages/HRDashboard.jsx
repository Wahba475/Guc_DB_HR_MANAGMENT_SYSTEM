import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HRSidebar from "../Components/HRSidebar";
import axios from "axios";
import {
  ClipboardCheck,
  FileCheck,
  CalendarCheck,
  ClipboardX,
  ClipboardList,
  DollarSign,
} from "lucide-react";

export default function HRDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("hrToken");

        const res = await axios.get("http://localhost:3000/HR/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex h-screen w-full">
        <HRSidebar />
        <div className="flex-1 flex justify-center items-center text-xl">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Annual & Accidental Requests",
      value: stats.pendingAnnual,
      icon: <ClipboardCheck className="w-10 h-10 text-blue-500" />,
      link: "/hr/approve-annual-accidental",
    },
    {
      title: "Unpaid Leave Requests",
      value: stats.pendingUnpaid,
      icon: <FileCheck className="w-10 h-10 text-blue-500" />,
      link: "/hr/approve-unpaid",
    },
    {
      title: "Compensation Requests",
      value: stats.pendingComp,
      icon: <CalendarCheck className="w-10 h-10 text-blue-500" />,
      link: "/hr/approve-compensation",
    },
    {
      title: "Missing Hours Records",
      value: stats.missingHours,
      icon: <ClipboardX className="w-10 h-10 text-blue-500" />,
      link: "/hr/deductions/missing-hours",
    },
    {
      title: "Missing Days Records",
      value: stats.missingDays,
      icon: <ClipboardList className="w-10 h-10 text-blue-500" />,
      link: "/hr/deductions/missing-days",
    },
    {
      title: "Payroll Entries",
      value: stats.payrollEntries,
      icon: <DollarSign className="w-10 h-10 text-blue-500" />,
      link: "/hr/payroll/generate",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <HRSidebar />

      <div className="flex-1 p-10 overflow-y-auto font-[Oswald]">
        <h1 className="text-4xl font-semibold text-blue-600 mb-6">
          HR Dashboard
        </h1>
        <p className="text-gray-600 mb-10">
          Manage approvals, deductions, and payroll operations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.link)}
              className="p-6 bg-white rounded-xl shadow-lg border border-gray-200
                flex flex-col gap-3 cursor-pointer
                hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              {card.icon}
              <h2 className="text-xl font-semibold text-blue-700">{card.title}</h2>
              <p className="text-4xl font-bold mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
