const express = require("express");
const router = express.Router();

const {
  HrLogin,
  getPendingAnnualAccidental,
  approveLeave,
  rejectLeave,
  getPendingUnpaidLeaves,
  approveUnpaidLeave,
  rejectUnpaidLeave,
  getPendingCompensation,
  approveCompensation,
  rejectCompensation,
  addMissingHoursDeduction,
  deductMissingDays,
  DeductionUnpaid,
  generatePayroll
} = require("../controllers/Hr_Controller");

const { verifyHRToken } = require("../middlewares/Hr_verify");

// LOGIN
router.post("/login", HrLogin);

// Annual & Accidental
router.get("/leaves/annual-accidental", verifyHRToken, getPendingAnnualAccidental);
router.put("/leaves/annual-accidental/approve/:leaveId", verifyHRToken, approveLeave);
router.put("/leaves/annual-accidental/reject/:leaveId", verifyHRToken, rejectLeave);

// Unpaid Leaves
router.get("/leaves/unpaid", verifyHRToken, getPendingUnpaidLeaves);
router.put("/leaves/unpaid/approve/:leaveId", verifyHRToken, approveUnpaidLeave);
router.put("/leaves/unpaid/reject/:leaveId", verifyHRToken, rejectUnpaidLeave);

// Compensation
router.get("/leaves/compensation", verifyHRToken, getPendingCompensation);
router.put("/leaves/compensation/approve/:leaveId", verifyHRToken, approveCompensation);
router.put("/leaves/compensation/reject/:leaveId", verifyHRToken, rejectCompensation);
router.post("/deductions/missing-hours/:empId",verifyHRToken,addMissingHoursDeduction);
router.post("/deduct/missing-days/:empId", verifyHRToken, deductMissingDays);
router.post("/deduction/unpaid", verifyHRToken, DeductionUnpaid);

router.post("/payroll/generate", verifyHRToken, generatePayroll);





module.exports = router;
