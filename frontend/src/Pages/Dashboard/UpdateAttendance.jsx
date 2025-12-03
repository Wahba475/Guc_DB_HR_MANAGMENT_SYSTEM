import React, { useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateAttendance() {
  const [employeeId, setEmployeeId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "http://localhost:3000/admin/update/attendance",
        {
          employeeId,
          checkInTime: checkIn,
          checkOutTime: checkOut,
        },
        config
      );

      toast.success(res.data.message || "Attendance Updated!" ,{ autoClose: 3000
      }
      );
      setEmployeeId("");
      setCheckIn("");
      setCheckOut("");
      

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update attendance",{
        autoClose:3000
      });
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      {/* CENTER FORM */}
      <div className="flex items-center justify-center p-10">
        <form
          onSubmit={handleUpdate}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md
                     border border-gray-200 animate-fadeIn"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Update Attendance
          </h1>

          {/* Employee ID */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Employee ID</label>
            <input
              type="number"
              className="w-full border px-4 py-2 rounded focus:outline-black"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />
          </div>

          {/* Check-in */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Check-In Time</label>
            <input
              type="time"
              className="w-full border px-4 py-2 rounded focus:outline-black"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>

          {/* Check-out */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">Check-Out Time</label>
            <input
              type="time"
              className="w-full border px-4 py-2 rounded focus:outline-black"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded 
                       hover:bg-gray-900 transition transform hover:-translate-y-1"
          >
            Update Attendance
          </button>
        </form>
      </div>
    </div>
  );
}
