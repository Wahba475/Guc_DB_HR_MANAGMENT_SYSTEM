import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./Components/Login";
import AdminDashboard from "./Pages/AdminDashboard";

// EMPLOYEE PAGES
import AllEmployees from "./Pages/Dashboard/AllEmployees";
import EmployeesPerDepartment from "./Pages/Dashboard/EmployeesPerDepartment";

// MEDICAL PAGES
import RejectedMedicalLeaves from "./Pages/Dashboard/RejectedMedicalLeaves";

// ATTENDANCE PAGES
import UpdateAttendance from "./Pages/Dashboard/UpdateAttendance";
import AddHoliday from "./Pages/Dashboard/AddHoliday";
import InitiateAttendance from "./Pages/Dashboard/InitializeAttendance";
import YesterdayAttendance from "./Pages/Dashboard/YesterdayAttendance";

import WinterPerformance from "./Pages/Dashboard/WinterPerformance";
import ClearHolidayAttendance from "./Pages/Dashboard/ClearHolidayAttendance";

import RemoveDayOff from "./Pages/Dashboard/RemoveDayOff";
 import RemoveApprovedLeaves from "./Pages/Dashboard/RemoveApprovedLeaves";
 import ReplaceEmployee from "./Pages/Dashboard/ReplaceEmployee";


 import UpdateEmployment from "./Pages/Dashboard/UpdateEmployment";
 import UpdateAllEmployment from "./Pages/Dashboard/UpdateAllEmployment";

import RemoveDeductions from "./Pages/Dashboard/RemoveDeductions";

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* DASHBOARD */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* EMPLOYEES */}
      <Route path="/employees" element={<AllEmployees />} />
      <Route path="/departments" element={<EmployeesPerDepartment />} />

      {/* MEDICAL */}
      <Route path="/rejected-leaves" element={<RejectedMedicalLeaves />} />

      {/* ATTENDANCE */}
      <Route path="/attendance" element={<UpdateAttendance />} />
      <Route path="/init-attendance" element={<InitiateAttendance />} />
      <Route path="/yesterday-attendance" element={<YesterdayAttendance />} />

      <Route path="/winter-performance" element={<WinterPerformance />} />

      <Route path="/remove-dayoff" element={<RemoveDayOff />} />
        <Route path="/remove-approved-leaves" element={<RemoveApprovedLeaves />} />
        <Route path="/replace-employee" element={<ReplaceEmployee />} />

      
      

        <Route path="/update-employment" element={<UpdateEmployment />} />
        <Route path="/update-all-employment" element={<UpdateAllEmployment />} />
     

      <Route
        path="/clear-holiday-attendance"
        element={<ClearHolidayAttendance />}
      />

      {/* HOLIDAYS */}
      <Route path="/holidays" element={<AddHoliday />} />

      {/* DEDUCTIONS */}
      <Route path="/deductions" element={<RemoveDeductions />} />
    </Routes>
  );
}

export default App;
