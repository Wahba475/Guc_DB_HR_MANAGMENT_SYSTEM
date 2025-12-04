import React, { useState } from "react";
import AcademicSidebar from "../../Components/AcademicSideBar";
import axios from "axios";
import { Star } from "lucide-react";

export default function AcademicPerformance() {
  const [semester, setSemester] = useState("");
  const [performance, setPerformance] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("academicToken");

  const fetchPerformance = async () => {
    if (!semester) {
      setError("Please choose a semester.");
      return;
    }
    setError("");

    try {
      const res = await axios.get(
        `http://localhost:3000/academic/performance/${semester}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.data.length === 0) {
        setPerformance(null);
        setError("No performance found for this semester.");
        return;
      }

      setPerformance(res.data.data[0]);
    } catch (err) {
      setError("Failed to fetch performance.");
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-50">
      <AcademicSidebar />

      {/* MAIN CONTENT (center everything) */}
      <div className="flex flex-col items-center justify-center p-10">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-emerald-800 text-center">
          My Performance ⭐
        </h1>

        {/* Semester Selection */}
        <div className="mb-8 flex items-center gap-4">
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none 
                       focus:border-emerald-600"
          >
            <option value="">Choose Semester</option>
            <option value="W25">W25</option>
            <option value="S24">S24</option>
            <option value="W24">W24</option>
            <option value="S23">S23</option>
            <option value="W23">W23</option>
          </select>

          <button
            onClick={fetchPerformance}
            className="px-6 py-2 rounded-md bg-emerald-700 text-white 
                       hover:bg-emerald-800 transition"
          >
            View
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Center Card */}
        {performance && (
          <div className="p-6 bg-white shadow-md rounded-xl w-full max-w-lg text-center">

            {/* Rating */}
            <div className="flex justify-center items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`w-6 h-6 ${
                    n <= performance.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill={n <= performance.rating ? "#FACC15" : "none"}
                />
              ))}
            </div>

            <p className="text-gray-700 text-lg mb-2">
              <strong>Semester:</strong> {performance.semester}
            </p>

            <p className="text-gray-700 text-lg">
              <strong>Comments:</strong> {performance.comments}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
