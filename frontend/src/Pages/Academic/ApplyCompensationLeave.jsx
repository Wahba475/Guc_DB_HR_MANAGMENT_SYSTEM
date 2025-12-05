import React, { useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { Repeat } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ApplyCompensationLeave() {
  const [form, setForm] = useState({
    compensation_date: "",
    date_of_original_workday: "",
    reason: "",
    replacement_emp: ""
  });

  const token = localStorage.getItem("academicToken");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitCompensation = async () => {
    if (
      !form.compensation_date ||
      !form.date_of_original_workday ||
      !form.reason ||
      !form.replacement_emp
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/academic/leaves/compensation/apply",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Compensation leave submitted!");

      setForm({
        compensation_date: "",
        date_of_original_workday: "",
        reason: "",
        replacement_emp: ""
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit compensation leave.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="flex flex-col items-center justify-center p-10">
        <div className="bg-white p-8 shadow-md rounded-xl w-full max-w-lg">

          <h1 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
            <Repeat className="w-6 h-6" />
            Apply for Compensation Leave
          </h1>

          {/* Compensation Date */}
          <label className="block mb-1">Compensation Date</label>
          <input
            type="date"
            name="compensation_date"
            value={form.compensation_date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {/* Original Workday */}
          <label className="block mb-1">Original Workday</label>
          <input
            type="date"
            name="date_of_original_workday"
            value={form.date_of_original_workday}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {/* Reason */}
          <label className="block mb-1">Reason</label>
          <input
            type="text"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="ex: Worked on day off"
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {/* Replacement Employee */}
          <label className="block mb-1">Replacement Employee ID</label>
          <input
            type="number"
            name="replacement_emp"
            value={form.replacement_emp}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-6"
          />

          <button
            onClick={submitCompensation}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
