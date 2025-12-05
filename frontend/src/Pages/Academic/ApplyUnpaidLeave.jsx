import React, { useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { Ban } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ApplyUnpaidLeave() {
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    document_description: "",
    file_name: ""
  });

  const token = localStorage.getItem("academicToken");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitUnpaid = async () => {
    if (!form.start_date || !form.end_date || !form.file_name) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/academic/leaves/unpaid/apply",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Unpaid leave submitted successfully!");

      setForm({
        start_date: "",
        end_date: "",
        document_description: "",
        file_name: ""
      });

    } catch (err) {
      console.log(err.response?.data || err);
      toast.error("Failed to submit unpaid leave.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="flex flex-col items-center justify-center p-10">
        <div className="bg-white p-8 shadow-md rounded-xl w-full max-w-lg">

          <h1 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
            <Ban className="w-6 h-6" />
            Apply for Unpaid Leave
          </h1>

          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          <label className="block mb-1">End Date</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          <label className="block mb-1">Document Description (optional)</label>
          <input
            type="text"
            name="document_description"
            value={form.document_description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          <label className="block mb-1">PDF File Name</label>
          <input
            type="text"
            name="file_name"
            placeholder="e.g. report.pdf"
            value={form.file_name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-6"
          />

          <button
            onClick={submitUnpaid}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg"
          >
            Submit Unpaid Leave
          </button>
        </div>
      </div>
    </div>
  );
}
