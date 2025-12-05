// Backend/controllers/Hr_Controller.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const { getPool } = require("../Db/db_connection.js");

/* ============================================================
   HR LOGIN
============================================================ */
const HrLogin = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and password are required.",
      });
    }

    const pool = await getPool();

    const result = await pool
      .request()
      .input("id", sql.Int, employeeId)
      .query(`
        SELECT employee_id, first_name, last_name, dept_name, password AS dbPassword
        FROM Employee
        WHERE employee_id = @id
      `);

    const user = result.recordset[0];

    if (!user) return res.status(401).json({ message: "Invalid employee ID" });

    if (user.dept_name.trim().toUpperCase() !== "HR") {
      return res.status(403).json({ message: "Not authorized as HR" });
    }

    if (user.dbPassword !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user.employee_id, role: "HR" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "HR login successful",
      token,
      data: user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

/* ============================================================
   FETCH PENDING ANNUAL + ACCIDENTAL LEAVES
============================================================ */
const getPendingAnnualAccidental = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
          L.request_ID AS leave_id,
          COALESCE(AL.emp_ID, AC.emp_ID) AS employee_id,
          E.first_name, 
          E.last_name,
          CASE 
              WHEN AL.request_ID IS NOT NULL THEN 'annual'
              WHEN AC.request_ID IS NOT NULL THEN 'accidental'
          END AS leave_type,
          L.start_date, 
          L.end_date,
          L.final_approval_status AS status
      FROM [Leave] L
      LEFT JOIN Annual_Leave AL ON L.request_ID = AL.request_ID
      LEFT JOIN Accidental_Leave AC ON L.request_ID = AC.request_ID
      JOIN Employee E ON E.employee_id = COALESCE(AL.emp_ID, AC.emp_ID)
      WHERE L.final_approval_status = 'Pending'
    `);

    res.json({ success: true, data: result.recordset });

  } catch (err) {
    console.error("Fetch Pending Leaves Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaves",
      error: err.message,
    });
  }
};

/* ============================================================
   APPROVE ANNUAL / ACCIDENTAL LEAVE
============================================================ */
const approveLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const pool = await getPool();

    // Identify leave + employee + type
    const leave = await pool.request()
      .input("id", sql.Int, leaveId)
      .query(`
        SELECT 
            COALESCE(AL.emp_ID, AC.emp_ID) AS employee_id,
            L.num_days,
            CASE 
                WHEN AL.request_ID IS NOT NULL THEN 'annual'
                WHEN AC.request_ID IS NOT NULL THEN 'accidental'
            END AS leave_type
        FROM Leave L
        LEFT JOIN Annual_Leave AL ON L.request_ID = AL.request_ID
        LEFT JOIN Accidental_Leave AC ON L.request_ID = AC.request_ID
        WHERE L.request_ID = @id
      `);

    const row = leave.recordset[0];
    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    const { employee_id, leave_type, num_days } = row;

    // Deduct from annual balance only for annual leave
    if (leave_type === "annual") {
      await pool.request()
        .input("empId", sql.Int, employee_id)
        .input("days", sql.Int, num_days || 1)
        .query(`
          UPDATE Employee
          SET annual_balance = annual_balance - @days
          WHERE employee_id = @empId;
        `);
    }

    // Approve leave in main Leave table
    await pool.request()
      .input("id", sql.Int, leaveId)
      .query(`
        UPDATE Leave
        SET final_approval_status = 'Approved'
        WHERE request_ID = @id;
      `);

    res.json({ success: true, message: "Leave approved" });

  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({
      success: false,
      message: "Approval failed",
      error: err.message,
    });
  }
};

/* ============================================================
   REJECT ANNUAL / ACCIDENTAL LEAVE
============================================================ */
const rejectLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const pool = await getPool();

    await pool.request()
      .input("id", sql.Int, leaveId)
      .query(`
        UPDATE Leave
        SET final_approval_status = 'Rejected'
        WHERE request_ID = @id;
      `);

    res.json({ success: true, message: "Leave rejected" });

  } catch (err) {
    console.error("Reject Error:", err);
    res.status(500).json({
      success: false,
      message: "Rejection failed",
      error: err.message,
    });
  }
};

/* ============================================================
   FETCH PENDING UNPAID LEAVES
============================================================ */
const getPendingUnpaidLeaves = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
          L.request_ID AS leave_id,
          U.Emp_ID AS employee_id,
          E.first_name,
          E.last_name,
          L.start_date,
          L.end_date,
          L.final_approval_status AS status,
          D.description AS reason
      FROM [Leave] L
      JOIN Unpaid_Leave U ON U.request_ID = L.request_ID
      JOIN Employee E ON E.employee_id = U.Emp_ID
      LEFT JOIN Document D ON D.unpaid_ID = U.request_ID
      WHERE L.final_approval_status = 'Pending';
    `);

    res.json({ success: true, data: result.recordset });

  } catch (err) {
    console.error("Fetch Pending Unpaid Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unpaid leaves",
      error: err.message,
    });
  }
};

/* ============================================================
   APPROVE UNPAID LEAVE
============================================================ */
const approveUnpaidLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const hrId = req.user?.id;

    if (!hrId) {
      return res.status(401).json({
        success: false,
        message: "HR identity missing in token.",
      });
    }

    const pool = await getPool();

    await pool.request()
      .input("request_ID", sql.Int, leaveId)
      .input("HR_ID", sql.Int, hrId)
      .query("EXEC HR_approval_Unpaid @request_ID, @HR_ID");

    const statusResult = await pool.request()
      .input("id", sql.Int, leaveId)
      .query(`
        SELECT final_approval_status
        FROM [Leave]
        WHERE request_ID = @id;
      `);

    const finalStatus = statusResult.recordset[0]?.final_approval_status;

    res.json({
      success: true,
      message: `Unpaid leave processed. Final status: ${finalStatus}`,
      status: finalStatus,
    });

  } catch (err) {
    console.error("Approve Unpaid Error:", err);
    res.status(500).json({
      success: false,
      message: "Unpaid approval failed",
      error: err.message,
    });
  }
};

/* ============================================================
   REJECT UNPAID LEAVE
============================================================ */
const rejectUnpaidLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const hrId = req.user?.id;

    const pool = await getPool();

    await pool.request()
      .input("id", sql.Int, leaveId)
      .input("hrId", sql.Int, hrId || null)
      .query(`
        UPDATE Employee_Approve_Leave
        SET status = 'Rejected'
        WHERE leave_ID = @id
          AND (@hrId IS NULL OR Emp1_ID = @hrId);
      `);

    await pool.request()
      .input("id", sql.Int, leaveId)
      .query(`
        UPDATE Leave
        SET final_approval_status = 'Rejected'
        WHERE request_ID = @id;
      `);

    res.json({ success: true, message: "Unpaid leave rejected" });

  } catch (err) {
    console.error("Reject Unpaid Error:", err);
    res.status(500).json({
      success: false,
      message: "Unpaid rejection failed",
      error: err.message,
    });
  }
};

/* ============================================================
   COMPENSATION LEAVES
============================================================ */
const getPendingCompensation = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
          L.request_ID AS leave_id,
          CL.emp_ID AS employee_id,
          E.first_name, 
          E.last_name,
          L.start_date, 
          L.end_date,
          L.final_approval_status AS status
      FROM [Leave] L
      JOIN Compensation_Leave CL ON L.request_ID = CL.request_ID
      JOIN Employee E ON E.employee_id = CL.emp_ID
      WHERE L.final_approval_status = 'Pending'
    `);

    res.json({ success: true, data: result.recordset });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch compensation leaves",
      error: err.message,
    });
  }
};

const approveCompensation = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const pool = await getPool();

    await pool.request()
      .input("id", sql.Int, leaveId)
      .query(`
        UPDATE Leave
        SET final_approval_status = 'Approved'
        WHERE request_ID = @id
      `);

    res.json({ success: true, message: "Compensation leave approved" });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Approval failed",
      error: err.message,
    });
  }
};

const rejectCompensation = async (req, res) => {
  try {
    const { leaveId } = req.params;

    const pool = await getPool();

    await pool.request()
      .input("id", sql.Int, leaveId)
      .query(`
        UPDATE Leave
        SET final_approval_status = 'Rejected'
        WHERE request_ID = @id
      `);

    res.json({ success: true, message: "Compensation leave rejected" });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Rejection failed",
      error: err.message,
    });
  }
};

const addMissingHoursDeduction = async (req, res) => {
    try {
      const { empId } = req.params;
  
      if (!empId) {
        return res.status(400).json({
          success: false,
          message: "Employee ID is required.",
        });
      }
  
      const pool = await getPool();
  
      await pool
        .request()
        .input("employee_ID", sql.Int, empId)
        .query("EXEC Deduction_hours @employee_ID");
  
      return res.json({
        success: true,
        message: `Missing-hours deduction calculated for employee ${empId}.`,
      });
    } catch (err) {
      console.error("Deduction_hours error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to calculate missing-hours deduction.",
        error: err.message,
      });
    }
  };

 

const deductMissingDays = async (req, res) => {
    try {
      const { empId } = req.params;
  
      if (!empId) {
        return res.status(400).json({
          success: false,
          message: "Employee ID is required",
        });
      }
  
      const pool = await getPool();
  
      await pool.request()
        .input("employee_id", sql.Int, empId)
        .query("EXEC Deduction_days @employee_id");
  
      return res.json({
        success: true,
        message: `Missing days deduction applied for employee ${empId}`
      });
  
    } catch (err) {
      console.error("Missing Days Error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to apply missing days deduction",
        error: err.message,
      });
    }
  };
  const DeductionUnpaid = async (req, res) => {
    try {
      const { employeeId } = req.body;
  
      const pool = await getPool();
  
      const result = await pool.request()
        .input("employee_ID", sql.Int, employeeId)
        .query("EXEC Deduction_unpaid @employee_ID");
  
      res.json({
        success: true,
        message: "Unpaid leave deduction processed successfully",
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Deduction failed",
        error: err.message,
      });
    }
  };

  const generatePayroll = async (req, res) => {
    try {
      const { employeeId, month } = req.body;
  
      if (!employeeId || !month) {
        return res.status(400).json({
          success: false,
          message: "Employee ID and month are required",
        });
      }
  
      // Compute first and last day of month
      const year = new Date().getFullYear();
  
      const fromDate = new Date(year, month - 1, 1); 
      const toDate = new Date(year, month, 0); // last day of month
  
      const pool = await getPool();
  
      await pool.request()
        .input("employee_ID", sql.Int, employeeId)
        .input("from", sql.Date, fromDate)
        .input("to", sql.Date, toDate)
        .query("EXEC Add_Payroll @employee_ID, @from, @to");
  
      return res.json({
        success: true,
        message: `Payroll generated successfully for employee ${employeeId} for month ${month}.`
      });
  
    } catch (err) {
      console.error("Payroll Generation Error:", err);
      res.status(500).json({
        success: false,
        message: "Failed to generate payroll",
        error: err.message,
      });
    }
  };
  
  
  

  
  
  
  
  

/* ============================================================
   EXPORTS 
============================================================ */
module.exports = {
  HrLogin,
  getPendingAnnualAccidental,
  approveLeave,
  rejectLeave,
  getPendingUnpaidLeaves,
  approveUnpaidLeave,
  rejectUnpaidLeave,
  getPendingCompensation,
  approveCompensation,
  rejectCompensation,addMissingHoursDeduction,
  deductMissingDays,
  DeductionUnpaid,
  generatePayroll
};
