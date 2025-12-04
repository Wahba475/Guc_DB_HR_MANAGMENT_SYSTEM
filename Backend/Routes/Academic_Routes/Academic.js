const express = require("express");
const router = express.Router();

const {
  academicLogin,
  getMyPerformance,getMyAttendance,getMyLeaves,getLastMonthPayroll,getMyDeductions,applyAnnualLeave
} = require("../../controllers/Academic_Controller");

const { verifyAcademicToken } = require("../../middlewares/verifyAcademicToken");

router.post("/login", academicLogin);

router.get( "/performance/:semester", verifyAcademicToken, getMyPerformance);

// attendance (current month)
router.get("/attendance", verifyAcademicToken, getMyAttendance);
router.get("/leaves", verifyAcademicToken, getMyLeaves);
router.get("/payroll", verifyAcademicToken, getLastMonthPayroll);
router.get("/deductions/:month", verifyAcademicToken, getMyDeductions);
router.post("/annual-leave", verifyAcademicToken, applyAnnualLeave);






module.exports = router;
