import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, UserCog, GraduationCap } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const options = [
    {
      label: "Admin",
      icon: Shield,
      path: "/login",
      color: "bg-black text-white",
      hoverColor: "hover:bg-gray-900",
    },
    {
      label: "HR",
      icon: UserCog,
      path: "/hr-login",
      color: "bg-blue-600 text-white",
      hoverColor: "hover:bg-blue-700",
    },
    {
      label: "Academic Employee",
      icon: GraduationCap,
      path: "/academiclogin",
      color: "bg-green-600 text-white",
      hoverColor: "hover:bg-green-700",
    },
  ];

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
        {options.map((opt, index) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.label}
              onClick={() => navigate(opt.path)}
              style={{ animationDelay: `${index * 150}ms` }}
              className={`cursor-pointer rounded-xl shadow-lg p-10 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:scale-105 animate-fade-in ${opt.color} ${opt.hoverColor} group`}
            >
              <Icon className="w-16 h-16 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <h2 className="text-2xl font-bold transition-transform duration-300 group-hover:scale-105">
                {opt.label}
              </h2>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
