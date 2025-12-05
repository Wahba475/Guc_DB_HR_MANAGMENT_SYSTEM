const express = require("express");
const router = express.Router();

const {
  academicLogin,
  getMyPerformance,
  getMyAttendance,
  getMyLeaves,
  getLastMonthPayroll,
  getMyDeductions,

  // SUBMIT LEAVES
  applyAnnualLeave,
  applyAccidentalLeave,
  applyMedicalLeave,
  submitUnpaidLeave,
  submitCompensationLeave,

  // APPROVALS

  evaluateEmployee,

  // UNPAID APPROVAL FIXED
  getPendingUnpaidLeaves,
  reviewUnpaidLeave,
  reviewAnnualLeave,
  getPendingAnnualLeaves,
  getEmployeesSameDepartment
} = require("../../controllers/Academic_Controller");

const { verifyAcademicToken } = require("../../middlewares/verifyAcademicToken");


// -------------------- LOGIN --------------------
router.post("/login", academicLogin);


// -------------------- STUDENT/ACADEMIC FEATURES --------------------
router.get("/performance/:semester", verifyAcademicToken, getMyPerformance);
router.get("/attendance", verifyAcademicToken, getMyAttendance);
router.get("/leaves", verifyAcademicToken, getMyLeaves);
router.get("/payroll", verifyAcademicToken, getLastMonthPayroll);
router.get("/deductions/:month", verifyAcademicToken, getMyDeductions);


// -------------------- SUBMIT LEAVES --------------------
router.post("/leaves/annual/apply", verifyAcademicToken, applyAnnualLeave);
router.post("/leaves/accidental/apply", verifyAcademicToken, applyAccidentalLeave);
router.post("/leaves/medical/apply", verifyAcademicToken, applyMedicalLeave);
router.post("/leaves/unpaid/apply", verifyAcademicToken, submitUnpaidLeave);
router.post("/leaves/compensation/apply", verifyAcademicToken, submitCompensationLeave);


// -------------------- APPROVALS --------------------


// **THE ONLY CORRECT ROUTES FOR UNPAID APPROVAL**
router.get("/leaves/unpaid/pending", verifyAcademicToken, getPendingUnpaidLeaves);
router.post("/leaves/unpaid/review", verifyAcademicToken,reviewUnpaidLeave);


// -------------------- DEAN / HR EVALUATION --------------------
router.post("/evaluate", verifyAcademicToken, evaluateEmployee);
router.post("/leaves/annual/review", verifyAcademicToken, reviewAnnualLeave);
router.get("/leaves/annual/pending", verifyAcademicToken, getPendingAnnualLeaves);
router.get("/evaluate/employees", verifyAcademicToken, getEmployeesSameDepartment);



module.exports = router;
