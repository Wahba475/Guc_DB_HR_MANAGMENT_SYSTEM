import React, { useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { CalendarPlus } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

export default function ApplyLeave() {
  const [replacementEmp, setReplacementEmp] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const token = localStorage.getItem("academicToken");

  const submitLeave = async () => {
    if (!replacementEmp || !start || !end) {
      toast.error("All fields are required!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/academic/annual-leave",
        {
          replacement_emp: replacementEmp,
          start_date: start,
          end_date: end
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Annual leave request submitted!");

      // Navigate to the leaves list after success
      setTimeout(() => {
        window.location.href = "/academic/leaves";
      }, 1500);

    } catch (err) {
      console.log(err);
      toast.error("Failed to submit leave.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="p-10 flex flex-col items-center">

        <h1 className="text-3xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
          <CalendarPlus className="w-8 h-8" />
          Apply for Annual Leave
        </h1>

        <div className="bg-white shadow-md rounded-xl p-8 max-w-lg w-full space-y-5">

          {/* REPLACEMENT EMP ID */}
          <div>
            <label className="font-semibold">Replacement Employee ID</label>
            <input
              type="number"
              value={replacementEmp}
              onChange={(e) => setReplacementEmp(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>

          {/* START DATE */}
          <div>
            <label className="font-semibold">Start Date</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>

          {/* END DATE */}
          <div>
            <label className="font-semibold">End Date</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
          </div>

          <button
            onClick={submitLeave}
            className="w-full bg-emerald-700 text-white py-2 rounded-md hover:bg-emerald-800 transition"
          >
            Submit Request
          </button>
        </div>

        <ToastContainer position="top-right" />
      </div>
    </div>
  );
}
