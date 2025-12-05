import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  DollarSign,
  ChevronDown,
  LogOut,
  ClipboardCheck,
  RefreshCcw,
} from "lucide-react";

export default function Sidebar() {
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const sections = [
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      links: [
        { to: "/employees", label: "All Employees" },
        { to: "/departments", label: "Employees Per Department" },
      ],
    },
    {
      id: "medical",
      label: "Medical",
      icon: FileText,
      links: [{ to: "/rejected-leaves", label: "Rejected Leaves" }],
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: ClipboardCheck,
      links: [
        { to: "/attendance", label: "Update Attendance" },
        { to: "/init-attendance", label: "Initialize Today" },
        { to: "/yesterday-attendance", label: "Yesterday Attendance" },
        { to: "/winter-performance", label: "Winter Performance" },
        { to: "/clear-holiday-attendance", label: "Clear Holiday Attendance" },
        // The following routes are for later tasks (backend/frontend to be added):
        { to: "/remove-dayoff", label: "Remove Day-Off Records" },
        { to: "/remove-approved-leaves", label: "Remove Approved Leaves" },
        { to: "/replace-employee", label: "Replace Employee" },
      ],
    },
    {
      id: "employment",
      label: "Employment",
      icon: RefreshCcw,
      links: [
        { to: "/update-employment", label: "Update One Employee Status" },
        { to: "/update-all-employment", label: "Update All Employees Status" },
      ],
    },
    {
      id: "holidays",
      label: "Holidays",
      icon: Calendar,
      links: [{ to: "/holidays", label: "Add Holiday" }],
    },
    {
      id: "deductions",
      label: "Deductions",
      icon: DollarSign,
      links: [{ to: "/deductions", label: "Remove Deductions" }],
    },
  ];

  return (
    <div className="h-screen w-64 bg-black text-white flex flex-col border-r border-gray-800">
      {/* TOP */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Dashboard Link */}
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mb-3 transition ${
              isActive
                ? "bg-gray-800 text-white"
                : "hover:bg-gray-900 text-gray-300"
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        {/* Collapsible Sections */}
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSection === section.id;

          return (
            <div key={section.id} className="mb-3">
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                  isOpen ? "bg-gray-800" : "hover:bg-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {section.label}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pl-6 mt-2 space-y-2">
                  {section.links.map((link) => (
                    <NavLink
                      to={link.to}
                      key={link.to}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm transition ${
                          isActive
                            ? "bg-gray-700 text-white"
                            : "text-gray-400 hover:bg-gray-900 hover:text-white"
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
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
                     text-red-400 hover:bg-red-900/30 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
