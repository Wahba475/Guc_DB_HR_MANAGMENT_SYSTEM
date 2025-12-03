import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/SideBar";
import axios from "axios";
import { toast } from "react-toastify";

const formatSemester = (code) => {
  if (!code) return "—";
  return `Winter 20${code.substring(1)}`; // W25 → Winter 2025
};

export default function WinterPerformance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    fetchWinterPerformance();
  }, []);

  const fetchWinterPerformance = async () => {
    try {
      toast.loading("Fetching winter performance...");

      const res = await axios.get(
        "http://localhost:3000/admin/performance/winter",
        config
      );

      setRecords(res.data.data || []);

      toast.dismiss();
      toast.success("Loaded successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to load winter performance.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter((r) =>
    (r.first_name + " " + r.last_name)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen bg-gray-100">
      <Sidebar />

      <div className="p-10 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Winter Performance</h1>

        {/* SEARCH */}
        <div className="mb-6 flex justify-between">
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-72 focus:outline-black"
          />
        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500">No winter performance records found.</p>
        ) : (
          <div className="bg-white shadow rounded">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Semester</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Comments</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{r.emp_ID}</td>
                    <td className="p-3">{r.first_name} {r.last_name}</td>
                    <td className="p-3">{formatSemester(r.semester)}</td>
                    <td className="p-3">{r.rating}</td>
                    <td className="p-3">{r.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
