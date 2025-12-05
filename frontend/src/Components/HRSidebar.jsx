import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  ClipboardList,
  DollarSign,
  LogOut,
  ChevronDown,
  BriefcaseBusiness,
} from "lucide-react";

export default function HRSidebar() {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  const logout = () => {
    // 🔴 IMPORTANT: clear ALL tokens
    localStorage.removeItem("token");
    localStorage.removeItem("hrToken");
    navigate("/");
  };

  const sections = [
    {
      id: "approvals",
      label: "Leave Approvals",
      icon: ClipboardCheck,
      links: [
        { to: "/hr/approve-annual-accidental", label: "Annual & Accidental" },
        { to: "/hr/approve-unpaid", label: "Unpaid Leaves" },
        { to: "/hr/approve-compensation", label: "Compensation Leaves" },
      ],
    },
    {
      id: "deductions",
      label: "Deductions",
      icon: ClipboardList,
      links: [
        { to: "/hr/deductions/missing-hours", label: "Missing Hours" },
        { to: "/hr/missing-days", label: "Missing Days" },
        { to: "/hr/deduction/unpaid", label: "Unpaid Deduction" },
      ],
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: DollarSign,
      links: [{ to: "/hr/payroll/generate", label: "Generate Payroll" }],
    },
  ];

  return (
    <div className="h-screen w-64 bg-blue-600 text-white flex flex-col border-r border-blue-700 shadow-xl">
      {/* HEADER */}
      <div className="p-6 border-b border-blue-700 flex items-center gap-3">
        <BriefcaseBusiness className="w-6 h-6 text-blue-100" />
        <h1 className="text-xl font-semibold">HR Portal</h1>
      </div>

      {/* MAIN NAV */}
      <nav className="flex-1 overflow-y-auto p-4">
        <NavLink
          to="/hr-dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mb-3 transition 
            ${isActive ? "bg-blue-700" : "hover:bg-blue-700/40 text-blue-100"}`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        {sections.map((section) => {
          const Icon = section.icon;
          const open = openSection === section.id;

          return (
            <div key={section.id} className="mb-3">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition
                ${open ? "bg-blue-700" : "hover:bg-blue-700/40"}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {section.label}
                </div>

                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

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
                            ? "bg-blue-700 text-white"
                            : "text-blue-100 hover:bg-blue-700/40"
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
      <div className="p-4 border-t border-blue-700">
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
