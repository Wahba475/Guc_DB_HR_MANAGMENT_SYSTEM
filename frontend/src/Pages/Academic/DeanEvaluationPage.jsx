import React, { useEffect, useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import toast from "react-hot-toast";

export default function DeanEvaluationPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_ID: "",
    rating: "",
    comment: "",
    semester: ""
  });

  const token = localStorage.getItem("academicToken");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/academic/evaluate/employees",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(res.data.data);
    } catch (err) {
      toast.error("Failed to load employees.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitEvaluation = async () => {
    try {
      await axios.post(
        "http://localhost:3000/academic/evaluate",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Evaluation submitted!");
      setForm({ employee_ID: "", rating: "", comment: "", semester: "" });

    } catch (err) {
      console.log(err);
      toast.error("Failed to evaluate employee.");
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      <div className="p-10 max-w-2xl">

        <h1 className="text-3xl font-bold text-emerald-800 mb-6">
          Evaluate Employees
        </h1>

        {/* Employee Select */}
        <label>Employee</label>
        <select
          name="employee_ID"
          value={form.employee_ID}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Select Employee</option>
          {employees.map((e) => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.first_name} {e.last_name}
            </option>
          ))}
        </select>

        <label>Rating (1–5)</label>
        <input
          type="number"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <label>Semester</label>
        <input
          type="text"
          name="semester"
          placeholder="e.g. W25"
          value={form.semester}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <label>Comment (optional)</label>
        <textarea
          name="comment"
          value={form.comment}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-6"
        />

        <button
          onClick={submitEvaluation}
          className="bg-emerald-700 text-white py-2 w-full rounded"
        >
          Submit Evaluation
        </button>
      </div>
    </div>
  );
}
