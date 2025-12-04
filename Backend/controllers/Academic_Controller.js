require("dotenv").config();
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const { getPool } = require("../Db/db_connection.js");


// -------------------- LOGIN --------------------
const academicLogin = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({ message: "Employee ID and password are required." });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, employeeId)
      .query("SELECT * FROM Employee WHERE employee_id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const emp = result.recordset[0];

    // Convert department name into a normalized lowercase role
    const role = (emp.dept_name || "").toLowerCase();

    // Allowed access roles for the academic portal
    const allowedRoles = ["academic", "dean", "vice-dean", "president"];

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "You are not allowed to access this portal." });
    }

    // Password check
    if (emp.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: emp.employee_id,
        role: role,
        department: role
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      employee: {
        id: emp.employee_id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        role: role,
        department: role
      }
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// -------------------- GET MY PERFORMANCE --------------------
const getMyPerformance = async (req, res) => {
    try {
      const { semester } = req.params;
      const employeeId = req.user.id; // Comes from JWT middleware
  
      if (!semester) {
        return res.status(400).json({ message: "Semester is required." });
      }
  
      const pool = await getPool();
  
      const result = await pool
        .request()
        .input("employeeID", sql.Int, employeeId)
        .input("period", sql.Char(3), semester)
        .query(`
          SELECT *
          FROM dbo.MyPerformance(@employeeID, @period);
        `);
  
      return res.status(200).json({
        success: true,
        data: result.recordset,
      });
  
    } catch (error) {
      return res.status(500).json({
        message: "Failed to retrieve performance.",
        error: error.message,
      });
    }
  };
  // -------------------- GET MY ATTENDANCE (CURRENT MONTH) --------------------
const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user.id; // from JWT token

    const pool = await getPool();

    const result = await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .query(`
        SELECT *
        FROM dbo.MyAttendance(@employee_ID);
      `);

    return res.status(200).json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve attendance.",
      error: error.message,
    });
  }
};
// -------------------- GET MY LEAVES (CURRENT MONTH) --------------------
const getMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const pool = await getPool();

    const result = await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .query(`
        SELECT *
        FROM dbo.status_leaves(@employee_ID);
      `);

    return res.status(200).json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve leaves.",
      error: error.message,
    });
  }
};
// -------------------- GET LAST MONTH PAYROLL --------------------
const getLastMonthPayroll = async (req, res) => {
  try {
    const employeeId = req.user.id; // from token

    const pool = await getPool();

    const result = await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .query(`
        SELECT *
        FROM dbo.Last_month_payroll(@employee_ID);
      `);

    return res.status(200).json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve last month's payroll.",
      error: error.message,
    });
  }
};
// -------------------- GET ATTENDANCE-BASED DEDUCTIONS --------------------
const getMyDeductions = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { month } = req.params;

    if (!month || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ message: "Invalid month. Use 1–12." });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .input("month", sql.Int, month)
      .query(`
        SELECT *
        FROM dbo.Deductions_Attendance(@employee_ID, @month)
      `);

    return res.status(200).json({
      success: true,
      data: result.recordset
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve deductions.",
      error: error.message
    });
  }
};
// -------------------- APPLY FOR ANNUAL LEAVE --------------------
const applyAnnualLeave = async (req, res) => {
  try {
    const employeeId = req.user.id; // from token
    const { replacement_emp, start_date, end_date } = req.body;

    if (!replacement_emp || !start_date || !end_date) {
      return res.status(400).json({
        message: "replacement_emp, start_date, and end_date are required."
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .input("replacement_emp", sql.Int, replacement_emp)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .execute("Submit_annual");

    return res.status(200).json({
      success: true,
      message: "Annual leave request submitted successfully."
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit annual leave.",
      error: error.message
    });
  }
};



  



module.exports = { academicLogin, getMyPerformance,getMyAttendance,getMyLeaves,getLastMonthPayroll,getMyDeductions,applyAnnualLeave};
