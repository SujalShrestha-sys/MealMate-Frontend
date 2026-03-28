import React from "react";
import { UtensilsCrossed, Home } from "lucide-react";
import { Link } from "react-router-dom";

const roleStyles = {
  student: {
    gradient: "from-green-900/80 via-green-800/70 to-emerald-900/80",
    accentText: "text-emerald-300",
    copyrightText: "text-green-200/60",
    statLabel: "text-green-200/80",
    mobileLogo: "bg-green-600 text-green-600",
  },
  teacher: {
    gradient: "from-blue-900/80 via-blue-800/70 to-sky-900/80",
    accentText: "text-sky-300",
    copyrightText: "text-blue-200/60",
    statLabel: "text-blue-200/80",
    mobileLogo: "bg-blue-600 text-blue-600",
  },
  admin: {
    gradient: "from-indigo-900/80 via-indigo-800/70 to-violet-900/80",
    accentText: "text-violet-300",
    copyrightText: "text-indigo-200/60",
    statLabel: "text-indigo-200/80",
    mobileLogo: "bg-indigo-600 text-indigo-600",
  },
};

const AuthLayout = ({
  children,
  imageSrc,
  title,
  subtitle,
  extraLeftContent,
  role = "student",
}) => {
  const currentStyle = roleStyles[role] || roleStyles.student;

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background image */}
        <img
          src={imageSrc}
          alt="App Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentStyle.gradient}`}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 h-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 select-none w-fit hover:opacity-90 transition-opacity"
          >
            <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <UtensilsCrossed size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              MealMate
            </span>
          </Link>

          {/* Center Text */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              {title}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed font-medium">
              {subtitle}
            </p>

            {extraLeftContent && (
              <div className="mt-10">{extraLeftContent}</div>
            )}
          </div>

          {/* Copyright */}
          <p className={`text-sm ${currentStyle.copyrightText}`}>
            &copy; 2026 MealMate. All rights reserved. Made by Sujal Shrestha
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 bg-white h-full relative overflow-y-auto">
        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all duration-200 group z-20 bg-white"
          title="Back to Home"
        >
          <Home
            size={16}
            className="group-hover:-translate-y-0.5 transition-transform duration-200"
          />
          <span className="hidden sm:block text-sm font-medium">Home</span>
        </Link>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8 select-none">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-xl ${currentStyle.mobileLogo.split(" ")[0]} text-white`}
          >
            <UtensilsCrossed size={20} />
          </div>
          <span
            className={`text-xl font-bold ${currentStyle.mobileLogo.split(" ")[1]} tracking-tight`}
          >
            MealMate
          </span>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
