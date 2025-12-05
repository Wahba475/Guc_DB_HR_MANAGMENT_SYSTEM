import React, { useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { Stethoscope } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ApplyMedicalLeave() {
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    medical_type: "sick",
    insurance_status: 0,
    disability_details: "",
    document_description: "",
    file_name: ""
  });

  const token = localStorage.getItem("academicToken");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.start_date || !form.end_date || !form.file_name) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/academic/leaves/medical/apply",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Medical leave submitted successfully!");
      setForm({
        start_date: "",
        end_date: "",
        medical_type: "sick",
        insurance_status: 0,
        disability_details: "",
        document_description: "",
        file_name: ""
      });

    } catch (err) {
      console.log(err);
      toast.error("Failed to submit medical leave.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="flex flex-col items-center justify-center p-10">
        <div className="bg-white p-8 shadow-md rounded-xl w-full max-w-lg">

          <h1 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
            <Stethoscope className="w-6 h-6" />
            Apply for Medical Leave
          </h1>

          {/* Start Date */}
          <label className="block mb-1">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {/* End Date */}
          <label className="block mb-1">End Date</label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {/* Medical Type */}
          <label className="block mb-1">Medical Type</label>
          <select
            name="medical_type"
            value={form.medical_type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          >
            <option value="sick">Sick Leave</option>
            <option value="maternity">Maternity Leave</option>
          </select>

          {/* Insurance Status */}
          <label className="block mb-1">Insurance Status</label>
          <select
            name="insurance_status"
            value={form.insurance_status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          >
            <option value={1}>Covered</option>
            <option value={0}>Not Covered</option>
          </select>

          {/* Disability Details */}
          <label className="block mb-1">Disability Details (Optional)</label>
          <input
            type="text"
            name="disability_details"
            value={form.disability_details}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {/* Document Description */}
          <label className="block mb-1">Document Description</label>
          <input
            type="text"
            name="document_description"
            value={form.document_description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          {/* File Name */}
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
            onClick={handleSubmit}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-lg"
          >
            Submit Medical Leave
          </button>
        </div>
      </div>
    </div>
  );
}
