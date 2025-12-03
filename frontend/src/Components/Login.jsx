import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/admin/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      toast.success("✅ Login Successful!", {
        autoClose: 1500,
      });

      setTimeout(() => navigate("/admin-dashboard"), 1600);

    } catch (error) {
      const msg =
        error.response?.data?.message || "Server error. Try again later.";

      toast.error(`❌ ${msg}`, {
        autoClose: 2000,
      });

      localStorage.removeItem("token");
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-black font-[Oswald]">
      {/* Left Side Image */}
      <div className="hidden md:block w-1/2">
        <img
          className="h-full w-full object-cover grayscale"
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
          alt="Login Illustration"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6">
        <form
          className="w-full max-w-sm flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="text-4xl font-semibold text-center">Admin Login</h2>
          <p className="text-sm text-gray-600 mt-2">Sign in to continue</p>

          {/* Email */}
          <div className="mt-8 w-full">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter admin email"
              className="w-full border border-gray-300 h-12 px-4 text-sm rounded-md 
                         focus:outline-none focus:border-black"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mt-6 w-full">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 h-12 px-4 text-sm rounded-md 
                         focus:outline-none focus:border-black"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-8 w-full h-12 rounded-md bg-black text-white 
                       hover:bg-gray-900 transition-all duration-300 
                       hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Toast Container */}
        <ToastContainer position="top-right" />
      </div>
    </div>
  );
}
