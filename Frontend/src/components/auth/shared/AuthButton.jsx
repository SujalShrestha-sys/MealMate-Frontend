import React from "react";
import { ArrowRight } from "lucide-react";

const AuthButton = ({
  children,
  type = "button",
  onClick,
  className = "",
  role = "student",
}) => {
  const roleColors = {
    student:
      "bg-green-600 hover:bg-green-700 shadow-green-600/20 hover:shadow-green-600/30",
    teacher:
      "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 hover:shadow-blue-600/30",
    admin:
      "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 hover:shadow-indigo-600/30",
  };

  const currentColor = roleColors[role] || roleColors.student;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full ${currentColor} text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
    >
      {children}
      <ArrowRight size={18} />
    </button>
  );
};

export default AuthButton;
