import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AcademicLogin() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/academic/login", {
        employeeId,
        password,
      });

      localStorage.setItem("academicToken", response.data.token);

      toast.success("🎓 Login successful!", {
        autoClose: 1500,
      });

      setTimeout(() => navigate("/academic-dashboard"), 1600);

    } catch (error) {
      const msg =
        error.response?.data?.message || "Server error. Try again later.";

      toast.error(`❌ ${msg}`, { autoClose: 2000 });
      localStorage.removeItem("academicToken");
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-black font-[Oswald]">

      {/* Left Academic Image */}
      <div className="hidden md:block w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1350&q=80"
          alt="Academic Illustration"
        />
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6">
        <form
          className="w-full max-w-sm flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-semibold text-center text-emerald-700">
            Academic Login
          </h2>
          <p className="text-sm text-gray-600 mt-2">Sign in to continue</p>

          {/* Employee ID */}
          <div className="mt-8 w-full">
            <label className="block text-sm mb-1">Employee ID</label>
            <input
              type="number"
              placeholder="Enter your employee ID"
              className="w-full border border-gray-300 h-12 px-4 text-sm rounded-md
                         focus:outline-none focus:border-emerald-600"
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mt-6 w-full">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 h-12 px-4 text-sm rounded-md
                         focus:outline-none focus:border-emerald-600"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-8 w-full h-12 rounded-md bg-emerald-700 text-white 
                       hover:bg-emerald-800 transition-all duration-300 
                       hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          >
            Login
          </button>
        </form>

        <ToastContainer position="top-right" />
      </div>
    </div>
  );
}
