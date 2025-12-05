import React from "react";
import { Routes, Route } from "react-router-dom";

// LANDING + LOGIN
import LandingPage from "./Pages/LandingPage";
import Login from "./Components/Login";
import AcademicLogin from "./Components/AcademicLogin";

// ADMIN DASHBOARD
import AdminDashboard from "./Pages/AdminDashboard";

// ADMIN FEATURE PAGES
import AllEmployees from "./Pages/Dashboard/AllEmployees";
import EmployeesPerDepartment from "./Pages/Dashboard/EmployeesPerDepartment";
import RejectedMedicalLeaves from "./Pages/Dashboard/RejectedMedicalLeaves";
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

// ACADEMIC PART 1
import AcademicDashboard from "./Pages/AcademicDashboard";
import AcademicPerformance from "./Pages/Academic/AcademicPerformance";
import AcademicAttendance from "./Pages/Academic/AcademicAttendance";
import AcademicPayroll from "./Pages/Academic/AcademicPayroll";

// ACADEMIC PART 2 - LEAVES
import MyLeaves from "./Pages/Academic/MyLeaves";
import ApplyLeave from "./Pages/Academic/ApplyLeave";
import AcademicDeductions from "./Pages/Academic/AcademicDeductions";
import ApplyAccidentalLeave from "./Pages/Academic/ApplyAccidentalLeave";
import ApplyMedicalLeave from "./Pages/Academic/ApplyMedicalLeave";
import ApplyUnpaidLeave from "./Pages/Academic/ApplyUnpaidLeave";
import ApplyCompensationLeave from "./Pages/Academic/ApplyCompensationLeave";

// NEW APPROVAL PAGE
import PendingUnpaidLeaves from "./Pages/Academic/UnpaidApprovalPage";
import AnnualApprovalPage from "./Pages/Academic/AnnualApprovalPage";
import EvaluateEmployeePage from "./Pages/Academic/DeanEvaluationPage";
import HRLogin from "./Components/HRLogin";

import HRDashboard from "./Pages/HRDashboard";
import AnnualAccidentalLeaves from "./Pages/Hr/AnnualAccidentalLeaves";
import UnpaidLeaves from "./Pages/Hr/UnpaidLeaves";
import CompensationLeaves from "./Pages/Hr/CompensationLeaves";
import MissingHoursDeduction from "./Pages/Hr/MissingHoursDeduction";
import  MissingDays from "./Pages/Hr/MissingDays"
import DeductUnpaid from "./Pages/Hr/DeductUnpaid"
import HrGeneratePayroll from "./Pages/Hr/GeneratePayroll";


export default function App() {
  return (
    <Routes>
      {/*  LANDING PAGE */}
      <Route path="/" element={<LandingPage />} />

      {/*  LOGIN ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/academiclogin" element={<AcademicLogin />} />

      {/*  ADMIN */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/*  ACADEMIC */}
      <Route path="/academic-dashboard" element={<AcademicDashboard />} />

      {/* ======================== */}
      {/* ADMIN FEATURE ROUTES     */}
      {/* ======================== */}

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
      <Route
        path="/clear-holiday-attendance"
        element={<ClearHolidayAttendance />}
      />

      {/* EXTRA ADMIN */}
      <Route path="/remove-dayoff" element={<RemoveDayOff />} />
      <Route
        path="/remove-approved-leaves"
        element={<RemoveApprovedLeaves />}
      />
      <Route path="/replace-employee" element={<ReplaceEmployee />} />

      <Route path="/update-employment" element={<UpdateEmployment />} />
      <Route path="/update-all-employment" element={<UpdateAllEmployment />} />

      {/* HOLIDAYS */}
      <Route path="/holidays" element={<AddHoliday />} />

      {/* DEDUCTIONS */}
      <Route path="/deductions" element={<RemoveDeductions />} />

      {/* ======================== */}
      {/* ACADEMIC PART 1 ROUTES   */}
      {/* ======================== */}

      <Route path="/academic/performance" element={<AcademicPerformance />} />
      <Route path="/academic/attendance" element={<AcademicAttendance />} />
      <Route path="/academic/payroll" element={<AcademicPayroll />} />

      {/* ======================== */}
      {/* ACADEMIC PART 2 - LEAVES */}
      {/* ======================== */}

      <Route path="/academic/leaves" element={<MyLeaves />} />
      <Route path="/academic/leaves/apply" element={<ApplyLeave />} />
      <Route path="/academic/deductions" element={<AcademicDeductions />} />

      <Route
        path="/academic/leaves/accidental"
        element={<ApplyAccidentalLeave />}
      />
      <Route path="/academic/leaves/medical" element={<ApplyMedicalLeave />} />
      <Route path="/academic/leaves/unpaid" element={<ApplyUnpaidLeave />} />
      <Route
        path="/academic/leaves/compensation"
        element={<ApplyCompensationLeave />}
      />

      <Route
        path="/academic/approvals/unpaid"
        element={<PendingUnpaidLeaves />}
      />
      <Route
        path="/academic/annual-approvals"
        element={<AnnualApprovalPage />}
      />
      <Route path="/academic/evaluate" element={<EvaluateEmployeePage />} />
      <Route path="/HRLogin" element={<HRLogin />} />
      <Route path="/hr-dashboard" element={<HRDashboard />} />
      <Route
        path="/hr/approve-annual-accidental"
        element={<AnnualAccidentalLeaves />}
      />
      <Route path="/hr/approve-unpaid" element={<UnpaidLeaves />} />

      <Route path="/hr/approve-compensation" element={<CompensationLeaves />} />
      <Route
        path="/hr/deductions/missing-hours"
        element={<MissingHoursDeduction />}
      />
      <Route path="/hr/missing-days" element={<MissingDays />} />
      <Route path="/hr/deduction/unpaid" element={<DeductUnpaid />} />
      <Route path="/hr/payroll/generate" element={<HrGeneratePayroll />} />



    </Routes>
    

  );
}
