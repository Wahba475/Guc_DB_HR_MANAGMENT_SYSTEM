import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HRLogin() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/HR/login", {
        employeeId,
        password,
      });

      // 🧹 clear any old tokens
      localStorage.removeItem("token");
      localStorage.removeItem("hrToken");

      // ✅ store clean HR token
      localStorage.setItem("hrToken", response.data.token);

      toast.success("✅ HR Login Successful!", { autoClose: 1500 });

      setTimeout(() => navigate("/hr-dashboard"), 1600);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Server error. Try again later.";

      toast.error(`❌ ${msg}`, { autoClose: 2000 });

      localStorage.removeItem("token");
      localStorage.removeItem("hrToken");
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-black font-[Oswald]">
      <div className="hidden md:block w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="HR Illustration"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6">
        <form
          className="w-full max-w-sm flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-semibold text-center text-blue-600">
            HR Login
          </h2>
          <p className="text-sm text-gray-600 mt-2">Sign in to continue</p>

          <div className="mt-8 w-full">
            <label className="block text-sm mb-1">Employee ID</label>
            <input
              type="number"
              placeholder="Enter employee ID"
              className="w-full border border-gray-300 h-12 px-4 text-sm rounded-md 
                         focus:outline-none focus:border-blue-600"
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          <div className="mt-6 w-full">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 h-12 px-4 text-sm rounded-md 
                         focus:outline-none focus:border-blue-600"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="mt-8 w-full h-12 rounded-md bg-blue-600 text-white 
                       hover:bg-blue-700 transition-all duration-300 
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
