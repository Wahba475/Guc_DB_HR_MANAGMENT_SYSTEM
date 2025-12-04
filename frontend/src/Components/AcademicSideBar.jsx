import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  FileText,
  DollarSign,
  ClipboardList,
  LogOut,
  ChevronDown,
  GraduationCap
} from "lucide-react";

export default function AcademicSidebar() {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  const logout = () => {
    localStorage.removeItem("academicToken");
    navigate("/");
  };

  const sections = [
    {
      id: "performance",
      label: "Performance",
      icon: BookOpen,
      links: [{ to: "/academic/performance", label: "My Performance" }],
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: CalendarCheck,
      links: [{ to: "/academic/attendance", label: "My Attendance" }],
    },
    {
      id: "leaves",
      label: "Leaves",
      icon: FileText,
      links: [
        { to: "/academic/leaves", label: "My Leaves" },
        { to: "/academic/leaves/apply", label: "Apply for Leave" },
      ],
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: DollarSign,
      links: [{ to: "/academic/payroll", label: "Last Month Payroll" }],
    },
    {
      id: "deductions",
      label: "Deductions",
      icon: ClipboardList,
      links: [{ to: "/academic/deductions", label: "My Deductions" }],
    },
  ];

  return (
    <div className="h-screen w-64 bg-emerald-700 text-white flex flex-col border-r border-emerald-800 shadow-xl">

      {/* HEADER */}
      <div className="p-6 border-b border-emerald-800 flex items-center gap-3">
        <GraduationCap className="w-6 h-6" />
        <h1 className="text-xl font-semibold">Academic Portal</h1>
      </div>

      {/* MAIN NAV */}
      <nav className="flex-1 overflow-y-auto p-4">

        {/* Dashboard Button */}
        <NavLink
          to="/academic-dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mb-3 transition 
            ${
              isActive
                ? "bg-emerald-800"
                : "hover:bg-emerald-900/40 text-emerald-100"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        {/* COLLAPSIBLE SECTIONS */}
        {sections.map((section) => {
          const Icon = section.icon;
          const open = openSection === section.id;

          return (
            <div key={section.id} className="mb-3">

              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition
                ${open ? "bg-emerald-800" : "hover:bg-emerald-900/40"}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {section.label}
                </div>

                {/* ARROW ICON */}
                <ChevronDown
                  className={`w-4 h-4 transition-transform 
                  ${open ? "rotate-180" : "rotate-0"}`}
                />
              </button>

              {/* DROPDOWN LINKS */}
              {open && (
                <div className="pl-6 mt-2 space-y-2">
                  {section.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm transition 
                        ${
                          isActive
                            ? "bg-emerald-800 text-white"
                            : "text-emerald-100 hover:bg-emerald-900/40 hover:text-white"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-emerald-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
          text-red-200 hover:bg-red-900/40 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
