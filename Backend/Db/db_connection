const sql = require("mssql");
require('dotenv').config();

const config = {
  user: "wahba",
  password: "1234",
  server: "localhost",
  database: "University_HR_ManagementSystem",
  options: {
    instanceName: "SQLEXPRESS02",
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  port: 1433,
};

let pool;

/* ------------------ Create pool ------------------ */
async function getPool() {
  if (pool) return pool;

  try {
    pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server");

    // Ensure Holiday table exists
    await pool.request().execute("Create_Holiday");

    console.log("✔ Holiday table checked/created");
    return pool;

  } catch (err) {
    console.error("❌ SQL Connection Error:", err);
    pool = null;
    throw err;
  }
}

/* ------------------ Query helper ------------------ */
async function query(q) {
  const p = await getPool();
  return await p.request().query(q);
}

module.exports = { query, getPool };
