import React, { useEffect, useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { Wallet } from "lucide-react";

export default function AcademicPayroll() {
  const [payroll, setPayroll] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("academicToken");

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      const res = await axios.get("http://localhost:3000/academic/payroll", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const rows = res.data.data;

      if (!rows || rows.length === 0) {
        setError("No payroll found for last month.");
        setPayroll(null);
        return;
      }

      // 🔥 TAKE MOST RECENT PAYROLL ENTRY
      const latest = rows[rows.length - 1];
      setPayroll(latest);
      setError("");

    } catch (err) {
      console.log(err);
      setError("Failed to fetch payroll.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="p-10 flex flex-col items-center">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
          <Wallet className="w-8 h-8 text-emerald-700" />
          Last Month Payroll
        </h1>

        {/* ERROR */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* PAYROLL CARD */}
        {payroll && (
          <div className="bg-white shadow-md rounded-xl p-8 max-w-lg w-full">

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Payroll Summary
            </h2>

            <p><strong>Period:</strong> {payroll.from_date?.split("T")[0]} → {payroll.to_date?.split("T")[0]}</p>
            <p className="mt-2"><strong>Payment Date:</strong> {payroll.payment_date?.split("T")[0]}</p>

            <p className="mt-3 font-semibold text-gray-900">
              Net Salary: <span className="text-emerald-700 font-bold">{payroll.final_salary_amount} EGP</span>
            </p>

            <p><strong>Bonus:</strong> {payroll.bonus_amount} EGP</p>
            <p><strong>Deductions:</strong> {payroll.deductions_amount} EGP</p>

            <p className="mt-4"><strong>Comments:</strong> {payroll.comments || "None"}</p>
          </div>
        )}

      </div>
    </div>
  );
}
