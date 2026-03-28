import React, { useState } from "react";

const AuthInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightElement,
  required = false,
  role = "student",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const roleColors = {
    student: {
      focusIcon: "text-green-500",
      border: "focus:border-green-500",
      ring: "focus:ring-green-500/10",
    },
    teacher: {
      focusIcon: "text-blue-500",
      border: "focus:border-blue-500",
      ring: "focus:ring-blue-500/10",
    },
    admin: {
      focusIcon: "text-indigo-500",
      border: "focus:border-indigo-500",
      ring: "focus:ring-indigo-500/10",
    },
  };

  const colors = roleColors[role] || roleColors.student;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute left-4 top-3.5 transition-colors duration-200 ${
              isFocused ? colors.focusIcon : "text-gray-400"
            }`}
            size={20}
          />
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full ${Icon ? "pl-12" : "pl-4"} ${
            rightElement ? "pr-12" : "pr-4"
          } py-3.5 rounded-xl border border-gray-200 bg-white outline-none ${
            colors.border
          } focus:ring-4 ${
            colors.ring
          } transition-all duration-200 text-gray-900 placeholder:text-gray-400`}
          required={required}
        />
        {rightElement && (
          <div className="absolute right-4 top-3.5">{rightElement}</div>
        )}
      </div>
    </div>
  );
};

export default AuthInput;