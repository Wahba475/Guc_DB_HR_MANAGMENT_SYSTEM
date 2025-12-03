const express = require("express");
const router = express.Router();

const { loginAdmin, getAllEmployees, getEmployeesPerDepartment, getRejectedMedicalLeaves, removeResignedDeductions, updateTodayAttendance, removeHolidayAttendance, initiateTodayAttendance, addNewHoliday, getHolidaysCount, getYesterdayAttendance, getWinterPerformance, removeEmployeeDayOff, removeApprovedLeavesAttendance, replaceEmployee, updateEmploymentStatus, updateAllEmploymentStatuses } = require("../../controllers/Admin_Controllers");
const { verifyToken } = require("../../middlewares/admin_token");


router.post("/login", loginAdmin);
router.get("/employees", verifyToken, getAllEmployees);
router.get("/employees/count", verifyToken, getEmployeesPerDepartment);
router.get("/rejected/medical", verifyToken, getRejectedMedicalLeaves);
router.delete("/remove/resigned/deductions", verifyToken, removeResignedDeductions);
router.put("/update/attendance", verifyToken, updateTodayAttendance);
router.delete("/remove/holiday/attendance", verifyToken, removeHolidayAttendance);
router.post("/initiate/attendance", verifyToken, initiateTodayAttendance);
router.post("/add/holiday", verifyToken, addNewHoliday);
router.get("/holidays/count", verifyToken, getHolidaysCount);
router.get("/attendance/yesterday", verifyToken, getYesterdayAttendance);
router.get("/performance/winter", verifyToken, getWinterPerformance);
router.delete("/remove/EmployeeDayOff/:employeeId", verifyToken, removeEmployeeDayOff);
router.delete("/remove/approved/attendance", verifyToken, removeApprovedLeavesAttendance);
router.post("/employee/replace", verifyToken, replaceEmployee);
router.put("/update/employment-status",verifyToken,updateEmploymentStatus);
router.put("/update/employment-status/all",verifyToken,updateAllEmploymentStatuses);





module.exports = router;
