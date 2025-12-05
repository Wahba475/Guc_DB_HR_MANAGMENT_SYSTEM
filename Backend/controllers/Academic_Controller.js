require("dotenv").config();
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const { getPool } = require("../Db/db_connection.js");

/* ========================= LOGIN ========================= */
const academicLogin = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res
        .status(400)
        .json({ message: "Employee ID and password are required." });
    }

    const pool = await getPool();

    // 1) Get employee basic info
    const result = await pool
      .request()
      .input("id", sql.Int, employeeId)
      .query("SELECT * FROM Employee WHERE employee_id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const emp = result.recordset[0];

    // 2) Check password
    if (emp.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // 3) Get main role from Employee_Role / Role (highest priority rank)
    const roleResult = await pool
      .request()
      .input("id", sql.Int, emp.employee_id)
      .query(`
        SELECT TOP 1 ER.role_name
        FROM Employee_Role ER
        JOIN Role R ON ER.role_name = R.role_name
        WHERE ER.emp_ID = @id
        ORDER BY R.rank
      `);

    let roleName = roleResult.recordset[0]?.role_name || "";
    let normalizedRole = roleName.toLowerCase().replace(/\s+/g, "-"); // "Vice Dean" -> "vice-dean"

    // // 4) Only allow academic staff + upperboard into this portal
    // const allowedRoles = [
    //   "lecturer",
    //   "assistant-lecturer",
    //   "teaching-assistant",
    //   "ta",
    //   "dean",
    //   "vice-dean",
    //   "president",
    // ];

    // if (!allowedRoles.includes(normalizedRole)) {
    //   return res
    //     .status(403)
    //     .json({ message: "You are not allowed to access this portal." });
    // }

    // 5) Create token  (department is REAL dept_name, role is normalized role)
    const token = jwt.sign(
      {
        id: emp.employee_id,
        role: normalizedRole,
        department: emp.dept_name, // e.g. "MIS"
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
        role: normalizedRole,
        department: emp.dept_name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ========================= PERFORMANCE ========================= */
const getMyPerformance = async (req, res) => {
  try {
    const { semester } = req.params;
    const employeeId = req.user.id;

    const pool = await getPool();
    const result = await pool
      .request()
      .input("employeeID", sql.Int, employeeId)
      .input("period", sql.Char(3), semester)
      .query(`SELECT * FROM dbo.MyPerformance(@employeeID, @period);`);

    return res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve performance.", error: error.message });
  }
};

/* ========================= ATTENDANCE ========================= */
const getMyAttendance = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const pool = await getPool();

    const result = await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .query(`SELECT * FROM dbo.MyAttendance(@employee_ID);`);

    return res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve attendance.", error: error.message });
  }
};

/* ========================= MY LEAVES ========================= */
const getMyLeaves = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const pool = await getPool();
    const query = `
      SELECT 
        L.request_ID,
        L.date_of_request,
        L.final_approval_status,
        CASE
            WHEN AL.request_ID IS NOT NULL THEN 'Annual'
            WHEN AC.request_ID IS NOT NULL THEN 'Accidental'
            WHEN ML.request_ID IS NOT NULL THEN 'Medical'
            WHEN UL.request_ID IS NOT NULL THEN 'Unpaid'
            WHEN CL.request_ID IS NOT NULL THEN 'Compensation'
            ELSE 'Unknown'
        END AS leave_type
      FROM Leave L
      LEFT JOIN Annual_Leave AL ON L.request_ID = AL.request_ID AND AL.emp_ID = @emp_ID
      LEFT JOIN Accidental_Leave AC ON L.request_ID = AC.request_ID AND AC.emp_ID = @emp_ID
      LEFT JOIN Medical_Leave ML ON L.request_ID = ML.request_ID AND ML.Emp_ID = @emp_ID
      LEFT JOIN Unpaid_Leave UL ON L.request_ID = UL.request_ID AND UL.Emp_ID = @emp_ID
      LEFT JOIN Compensation_Leave CL ON L.request_ID = CL.request_ID AND CL.emp_ID = @emp_ID
      WHERE 
        AL.emp_ID = @emp_ID OR 
        AC.emp_ID = @emp_ID OR 
        ML.emp_ID = @emp_ID OR 
        UL.emp_ID = @emp_ID OR 
        CL.emp_ID = @emp_ID;
    `;

    const result = await pool
      .request()
      .input("emp_ID", sql.Int, employeeId)
      .query(query);

    return res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve leaves.", error: error.message });
  }
};

/* ========================= PAYROLL ========================= */
const getLastMonthPayroll = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const pool = await getPool();

    const result = await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .query(`SELECT * FROM dbo.Last_month_payroll(@employee_ID);`);

    return res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve payroll.", error: error.message });
  }
};

/* ========================= DEDUCTIONS ========================= */
const getMyDeductions = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { month } = req.params;

    const pool = await getPool();
    const result = await pool.request()
    .input("employee_ID", sql.Int, employeeId)
    .input("month", sql.Int, month)
    .query(`
      SELECT 
        deduction_ID,
        emp_ID AS employee_ID,
        amount,
        type,
        date,
        CASE 
          WHEN type = 'missing_hours' THEN 'Missing Hours'
          WHEN type = 'missing_days' THEN 'Missing Days'
          WHEN type = 'unpaid' THEN 'Unpaid Leave'
          ELSE type
        END AS reason
      FROM Deduction
      WHERE emp_ID = @employee_ID
        AND MONTH(date) = @month
      ORDER BY date DESC;
    `);
  
  

    return res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to retrieve deductions.", error: error.message });
  }
};

/* ========================= SUBMIT LEAVES ========================= */
const applyAnnualLeave = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { replacement_emp, start_date, end_date } = req.body;

    const pool = await getPool();

    await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .input("replacement_emp", sql.Int, replacement_emp)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .execute("Submit_annual");

    return res
      .status(200)
      .json({ success: true, message: "Annual leave submitted." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit annual leave.",
      error: error.message,
    });
  }
};

const applyAccidentalLeave = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { start_date, end_date } = req.body;

    const pool = await getPool();
    await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .execute("Submit_accidental");

    return res
      .status(200)
      .json({ success: true, message: "Accidental leave submitted." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit accidental leave.",
      error: error.message,
    });
  }
};

const applyMedicalLeave = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const {
      start_date,
      end_date,
      medical_type,
      insurance_status,
      disability_details,
      document_description,
      file_name,
    } = req.body;

    const pool = await getPool();

    await pool
      .request()
      .input("employee_ID", sql.Int, employeeId)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .input("medical_type", sql.VarChar, medical_type)
      .input("insurance_status", sql.Bit, insurance_status)
      .input("disability_details", sql.VarChar, disability_details || "")
      .input("document_description", sql.VarChar, document_description || "")
      .input("file_name", sql.VarChar, file_name)
      .execute("Submit_medical");

    return res
      .status(200)
      .json({ success: true, message: "Medical leave submitted." });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit medical leave.",
      error: error.message,
    });
  }
};

const submitUnpaidLeave = async (req, res) => {
  try {
    const empId = req.user.id;
    const { start_date, end_date, document_description, file_name } = req.body;

    const pool = await getPool();

    await pool
      .request()
      .input("employee_ID", sql.Int, empId)
      .input("start_date", sql.Date, start_date)
      .input("end_date", sql.Date, end_date)
      .input("document_description", document_description)
      .input("file_name", file_name)
      .execute("Submit_unpaid");

    return res.json({ success: true, message: "Unpaid leave submitted." });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to submit unpaid leave.",
      error: error.message,
    });
  }
};

const submitCompensationLeave = async (req, res) => {
  try {
    const empId = req.user.id;
    const { compensation_date, reason, date_of_original_workday, replacement_emp } =
      req.body;

    const pool = await getPool();

    await pool
      .request()
      .input("employee_ID", sql.Int, empId)
      .input("compensation_date", compensation_date)
      .input("reason", reason)
      .input("date_of_original_workday", date_of_original_workday)
      .input("rep_emp_id", replacement_emp)
      .execute("Submit_compensation");

    return res.json({
      success: true,
      message: "Compensation leave submitted.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to submit compensation leave.",
      error: error.message,
    });
  }
};

/* ========================= UNPAID APPROVAL ========================= */
const getPendingUnpaidLeaves = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        U.request_ID,
        L.date_of_request,
        L.start_date,
        L.end_date,
        L.final_approval_status,
        E.first_name + ' ' + E.last_name AS employee_name,
        E.employee_id
      FROM Unpaid_Leave U
      INNER JOIN Leave L ON U.request_ID = L.request_ID
      INNER JOIN Employee E ON U.Emp_ID = E.employee_id
      WHERE L.final_approval_status = 'Pending';
    `);

    return res.json({ success: true, data: result.recordset });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending unpaid leaves.",
      error: error.message,
    });
  }
};

const reviewUnpaidLeave = async (req, res) => {
  console.log("🔥 reviewUnpaidLeave HIT");

  try {
    const upperboardId = req.user?.id;
    const { request_ID, action } = req.body;

    console.log("Received:", { request_ID, action, upperboardId });

    if (!upperboardId) {
      console.log("❌ ERROR: No upperboardId from token");
      return res
        .status(401)
        .json({ message: "Unauthorized — missing user token." });
    }

    if (!["approve", "reject"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Action must be approve or reject." });
    }

    const pool = await getPool();

    if (action === "approve") {
      await pool
        .request()
        .input("request_ID", sql.Int, request_ID)
        .input("upperboard_ID", sql.Int, upperboardId)
        .execute("Upperboard_approve_unpaids");

      await pool.request().query(`
        UPDATE Leave 
        SET final_approval_status = 'Approved'
        WHERE request_ID = ${request_ID};
      `);

      return res.json({ success: true, message: "Unpaid leave approved." });
    }

    await pool.request().query(`
      UPDATE Employee_Approve_Leave
      SET status = 'Rejected'
      WHERE leave_ID = ${request_ID} AND Emp1_ID = ${upperboardId};

      UPDATE Leave
      SET final_approval_status = 'Rejected'
      WHERE request_ID = ${request_ID};
    `);

    return res.json({ success: true, message: "Unpaid leave rejected." });
  } catch (error) {
    console.log("🔥 SQL ERROR:", error);
    return res.status(500).json({
      message: "Failed to process unpaid leave.",
      error: error.message,
    });
  }
};

/* ========================= EVALUATION ========================= */
const evaluateEmployee = async (req, res) => {
  try {
    const evaluatorRole = req.user.role; // from token
    const evaluatorDept = (req.user.department || "").toLowerCase();

    // only dean / vice-dean / president
    const allowedEvaluatorRoles = ["dean", "vice-dean", "president"];
    if (!allowedEvaluatorRoles.includes(evaluatorRole)) {
      return res
        .status(403)
        .json({ message: "Only Deans / Vice-Deans / President can evaluate." });
    }

    const { employee_ID, rating, comment, semester } = req.body;

    const pool = await getPool();

    // 1) Check employee exists + same department
    const empCheck = await pool
      .request()
      .input("empId", sql.Int, employee_ID)
      .query(`
        SELECT employee_id, dept_name 
        FROM Employee 
        WHERE employee_id = @empId;
      `);

    if (empCheck.recordset.length === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const employeeDept = (empCheck.recordset[0].dept_name || "").toLowerCase();

    if (employeeDept !== evaluatorDept) {
      return res.status(403).json({
        message: "You can only evaluate employees in your department.",
      });
    }

    // 2) Call stored procedure
    await pool
      .request()
      .input("employee_ID", sql.Int, employee_ID)
      .input("rating", sql.Int, rating)
      .input("comment", sql.VarChar, comment || "")
      .input("semester", sql.Char(3), semester)
      .execute("Dean_andHR_Evaluation");

    return res.json({
      success: true,
      message: "Employee evaluated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to evaluate employee.",
      error: error.message,
    });
  }
};

/* ========================= ANNUAL APPROVAL (UPPERBOARD) ========================= */
const reviewAnnualLeave = async (req, res) => {
  console.log("🔥 Annual Review HIT");

  try {
    const upperboardId = req.user.id;
    const { request_ID, action } = req.body;

    console.log("Received Annual:", { request_ID, action, upperboardId });

    if (!upperboardId)
      return res
        .status(401)
        .json({ message: "Unauthorized — missing token" });

    if (!["approve", "reject"].includes(action))
      return res
        .status(400)
        .json({ message: "Action must be approve or reject." });

    const pool = await getPool();

    if (action === "approve") {
      await pool
        .request()
        .input("request_ID", sql.Int, request_ID)
        .input("Upperboard_ID", sql.Int, upperboardId)
        .execute("Upperboard_approve_annual");

      await pool
        .request()
        .input("request_ID", sql.Int, request_ID)
        .query(`
          UPDATE Leave
          SET final_approval_status = 'Approved'
          WHERE request_ID = @request_ID;
        `);

      return res.json({ success: true, message: "Annual leave approved." });
    }

    await pool
      .request()
      .input("request_ID", sql.Int, request_ID)
      .input("upperboard_ID", sql.Int, upperboardId)
      .query(`
        UPDATE Employee_Approve_Leave 
        SET status = 'Rejected'
        WHERE leave_ID = @request_ID AND Emp1_ID = @upperboard_ID;

        UPDATE Leave
        SET final_approval_status = 'Rejected'
        WHERE request_ID = @request_ID;
      `);

    return res.json({ success: true, message: "Annual leave rejected." });
  } catch (error) {
    console.log("🔥 Annual SQL ERROR:", error);
    return res.status(500).json({
      message: "Failed to process annual leave.",
      error: error.message,
    });
  }
};

const getPendingAnnualLeaves = async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request().query(`
      SELECT 
        A.request_ID,
        L.start_date,
        L.end_date,
        L.date_of_request,
        L.final_approval_status,
        E.first_name + ' ' + E.last_name AS employee_name,
        R.first_name + ' ' + R.last_name AS replacement_name
      FROM Annual_Leave A
      JOIN Leave L ON A.request_ID = L.request_ID
      JOIN Employee E ON A.emp_ID = E.employee_id
      LEFT JOIN Employee R ON A.replacement_emp = R.employee_id
      WHERE L.final_approval_status = 'Pending';
    `);

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ========================= GET EMPLOYEES IN SAME DEPT ========================= */
const getEmployeesSameDepartment = async (req, res) => {
  try {
    const deanDept = req.user.department;

    const pool = await getPool();
    const result = await pool
      .request()
      .input("dept_name", sql.VarChar, deanDept)
      .query(`
        SELECT employee_id, first_name, last_name 
        FROM Employee 
        WHERE dept_name = @dept_name;
      `);

    return res.json({ success: true, data: result.recordset });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees.",
      error: err.message,
    });
  }
};

/* ========================= EXPORTS ========================= */
module.exports = {
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

  // UNPAID APPROVAL
  getPendingUnpaidLeaves,
  reviewUnpaidLeave,

  // EVALUATION + ANNUAL APPROVAL
  evaluateEmployee,
  reviewAnnualLeave,
  getPendingAnnualLeaves,
  getEmployeesSameDepartment,
};
