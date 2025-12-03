require('dotenv').config();
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const { query, getPool } = require('../Db/db_connection');

const toSqlTime = (value, label) => {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string") throw new Error(`${label} must be a string in HH:MM or HH:MM:SS`);
    const trimmed = value.trim();
    const parts = trimmed.split(":");
    if (parts.length < 2 || parts.length > 3) throw new Error(`${label} must follow HH:MM or HH:MM:SS`);
    const [h, m, s = "00"] = parts;
    const hours = Number(h);
    const minutes = Number(m);
    const seconds = Number(s);
    if ([hours, minutes, seconds].some(Number.isNaN)) throw new Error(`${label} contains non-numeric values`);
    if (hours < 0 || hours > 23) throw new Error(`${label} hour must be between 00 and 23`);
    if (minutes < 0 || minutes > 59) throw new Error(`${label} minute must be between 00 and 59`);
    if (seconds < 0 || seconds > 59) throw new Error(`${label} second must be between 00 and 59`);
    const date = new Date(0);
    date.setUTCHours(hours, minutes, seconds, 0);
    return date;
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // CREATE JWT TOKEN 
            const token = jwt.sign(
                { email: email },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );

            return res.status(200).json({
                message: "Admin login successful",
                token: token
            });
        }

        return res.status(401).json({ message: "Invalid email or password" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await query("SELECT * FROM Employee");
        return res.status(200).json(employees.recordset);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getEmployeesPerDepartment = async (req, res) => {
    try {
        const result = await query("SELECT * FROM NoEmployeeDept");
        return res.status(200).json(result.recordset);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const getRejectedMedicalLeaves = async (req, res) => {
    try {
        const result = await query("SELECT * FROM allRejectedMedicals");
        return res.status(200).json(result.recordset);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const removeResignedDeductions = async (req, res) => {
    try {
        const pool = await getPool();

        // 1️⃣ Execute the stored procedure to remove deductions
        await pool.request().execute("Remove_Deductions");

        // 2️⃣ Fetch all resigned employees
        const resignedEmployees = await pool.request().query(`
            SELECT employee_id, first_name, last_name, employment_status
            FROM Employee
            WHERE employment_status = 'resigned'
        `);

        // 3️⃣ Fetch updated deduction table (after deletions)
        const deductions = await pool.request().query(`
            SELECT 
                deduction_ID,
                emp_ID,
                amount,
                type,
                status,
                [date],     
                unpaid_ID,
                attendance_ID
            FROM Deduction
            ORDER BY deduction_ID
        `);

        return res.status(200).json({
            message: "Deductions removed for resigned employees.",
            resignedEmployees: resignedEmployees.recordset,
            deductions: deductions.recordset
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


  
const updateTodayAttendance = async (req, res) => {
    try {
        const { employeeId, checkInTime, checkOutTime } = req.body;
        if (!employeeId) {
            return res.status(400).json({ message: "employeeId is required" });
        }
        let checkInDate;
        let checkOutDate;
        try {
            checkInDate = toSqlTime(checkInTime, "checkInTime");
            checkOutDate = toSqlTime(checkOutTime, "checkOutTime");
        } catch (validationError) {
            return res.status(400).json({ message: validationError.message });
        }
        const pool = await getPool();
        await pool
            .request()
            .input("Employee_id", sql.Int, employeeId)
            .input("check_in_time", sql.Time, checkInDate)
            .input("check_out_time", sql.Time, checkOutDate)
            .execute("Update_Attendance");
        return res.status(200).json({
            message: "Attendance updated for today (based on given times)."
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const initiateTodayAttendance = async (req, res) => {
    try {
        const pool = await getPool();

        // 1️⃣ Run the stored procedure to insert today's attendance
        await pool.request().execute("Initiate_Attendance");

        // 2️⃣ Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().slice(0, 10);

        // 3️⃣ Fetch all attendance rows for today
        const result = await pool
            .request()
            .input("today", sql.Date, today)
            .query(`SELECT * FROM Attendance WHERE [date] = @today`);

        // 4️⃣ Send response
        return res.status(200).json({
            success: true,
            message: "Attendance initialized for today.",
            rows: result.recordset,
        });

    } catch (error) {
        console.error("Initialize Attendance Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to initialize today's attendance.",
            error: error.message,
        });
    }
};


const addNewHoliday = async (req, res) => {
    try {
        const { holidayName, fromDate, toDate } = req.body;

        if (!holidayName || !fromDate || !toDate) {
            return res.status(400).json({
                message: "holidayName, fromDate, and toDate are required.",
            });
        }

        const pool = await getPool();

        // Insert holiday
        await pool.request()
            .input("holiday_name", sql.VarChar(50), holidayName)
            .input("from_date", sql.Date, fromDate)
            .input("to_date", sql.Date, toDate)
            .execute("Add_Holiday");

        // Fetch updated table
        const result = await query("SELECT * FROM Holiday ORDER BY from_date");

        return res.status(200).json({
            message: "Holiday inserted successfully.",
            holidays: result.recordset,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getHolidaysCount = async (req, res) => {
    try {
        const result = await query("SELECT COUNT(*) AS count FROM Holiday");
        return res.status(200).json({ count: result.recordset[0].count });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//  admin component part 2------------------------------------------------------------------------------------------------------------------------------


const getYesterdayAttendance = async (req, res) => {
    try {
     
        const result = await query("SELECT * FROM allEmployeeAttendance");

        return res.status(200).json({
            success: true,
            message: "Yesterday attendance fetched successfully.",
            data: result.recordset
        });

    } catch (error) {
        console.error("Yesterday Attendance Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch yesterday attendance.",
            error: error.message
        });
    }
};
const getWinterPerformance = async (req, res) => {
    try {
      const sqlQuery = `
        SELECT 
          p.performance_ID,
          p.rating,
          p.comments,
          p.semester,
          p.emp_ID,
          e.first_name,
          e.last_name
        FROM Performance p
        INNER JOIN Employee e 
          ON p.emp_ID = e.employee_id
        WHERE p.semester LIKE 'W%'      -- all Winter semesters (W24, W25, ...)
        ORDER BY p.semester DESC, e.employee_id;
      `;
  
      const result = await query(sqlQuery);
  
      return res.status(200).json({
        data: result.recordset,
      });
    } catch (error) {
      console.error("Winter performance error:", error);
      return res.status(500).json({ message: error.message });
    }
  };
  

const removeHolidayAttendance = async (req, res) => {
    try {
        const pool = await getPool();

        await pool.request().execute("Remove_Holiday");

        return res.status(200).json({
            message: "Attendance entries inside holiday ranges have been removed."
        });

    } catch (error) {
        console.error("Error removing holiday attendance:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove holiday attendance.",
            error: error.message
        });
    }
};

const removeEmployeeDayOff = async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(400).json({ message: "employeeId is required." });
        }

        const pool = await getPool();

        await pool
            .request()
            .input("employee_ID", sql.Int, employeeId)
            .execute("Remove_DayOff");

        return res.status(200).json({
            success: true,
            message: `Unattended day-off records for employee ${employeeId} removed for this month.`,
        });

    } catch (error) {
        console.error("Error removing day-off attendance:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove unattended day-off attendance.",
            error: error.message,
        });
    }
};

const removeApprovedLeavesAttendance = async (req, res) => {
    try {
        const { employeeId } = req.body;

        if (!employeeId) {
            return res.status(400).json({ message: "employeeId is required." });
        }

        const pool = await getPool();

        await pool
            .request()
            .input("employee_id", sql.Int, employeeId)
            .execute("Remove_Approved_Leaves");

        return res.status(200).json({
            message: "Approved leave attendance removed successfully."
        });

    } catch (error) {
        console.error("Remove Approved Leaves Error:", error);
        return res.status(500).json({
            message: "Failed to remove approved leave attendance.",
            error: error.message
        });
    }
};
const replaceEmployee = async (req, res) => {
    try {
        const { emp1, emp2, fromDate, toDate } = req.body;

        if (!emp1 || !emp2 || !fromDate || !toDate) {
            return res.status(400).json({ message: "emp1, emp2, fromDate, and toDate are required." });
        }

        const pool = await getPool();

        await pool.request()
            .input("Emp1_ID", sql.Int, emp1)
            .input("Emp2_ID", sql.Int, emp2)
            .input("from_date", sql.Date, fromDate)
            .input("to_date", sql.Date, toDate)
            .execute("Replace_employee");

        return res.status(200).json({
            message: "Employee replaced successfully."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to replace employee.",
            error: error.message
        });
    }
};

//  da update le wa7d bs




const updateEmploymentStatus = async (req, res) => {
    try {
        const { employeeId } = req.body;

        if (!employeeId) {
            return res.status(400).json({ message: "employeeId is required." });
        }

        const pool = await getPool();

        await pool
            .request()
            .input("Employee_ID", sql.Int, employeeId)
            .execute("Update_Employment_Status");

        return res.status(200).json({
            message: `Employment status updated for employee ${employeeId}.`
        });

    } catch (error) {
        console.error("Update Employment Status Error:", error);
        return res.status(500).json({
            message: "Failed to update employment status.",
            error: error.message
        });
    }
};
// da update le kolo part 7 admin (extra)
const updateAllEmploymentStatuses = async (req, res) => {
    try {
        const pool = await getPool();

        // Fetch all employees
        const employees = await pool.request().query(`
            SELECT employee_id FROM Employee
        `);

        // Update each one
        for (const emp of employees.recordset) {
            await pool
                .request()
                .input("Employee_ID", sql.Int, emp.employee_id)
                .execute("Update_Employment_Status");
        }

        return res.status(200).json({
            message: "Employment status updated for ALL employees."
        });

    } catch (error) {
        console.error("Update All Employment Statuses Error:", error);
        return res.status(500).json({
            message: "Failed to update employment status for all.",
            error: error.message
        });
    }
};











module.exports = { loginAdmin, getAllEmployees, getEmployeesPerDepartment, getRejectedMedicalLeaves, removeResignedDeductions, updateTodayAttendance, removeHolidayAttendance, initiateTodayAttendance, addNewHoliday, getHolidaysCount,getYesterdayAttendance,getWinterPerformance,removeEmployeeDayOff,removeApprovedLeavesAttendance,replaceEmployee,updateEmploymentStatus,updateAllEmploymentStatuses};
