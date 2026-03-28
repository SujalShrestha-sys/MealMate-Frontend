import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthLayout from "./shared/AuthLayout";
import AuthInput from "./shared/AuthInput";
import AuthButton from "./shared/AuthButton";
import useAuthStore from "../../store/useAuthStore";
import authService from "../../api/services/auth.service";
import toast from "react-hot-toast";

const roleConfigs = {
  student: {
    title: (
      <>
        Skip the queue, <br />
        <span className="text-emerald-300">savor every bite.</span>
      </>
    ),
    subtitle:
      "Order fresh meals from your college canteen — no waiting, no hassle.",
    image: "/images/Background_2.jpg",
    stats: [
      { label: "Happy Students", value: "1000+" },
      { label: "Meals Daily", value: "Fresh" },
      { label: "Avg. Pickup", value: "5 min" },
    ],
    welcomeTitle: "Student Login",
    welcomeSubtitle: "Access your personalized student meal dashboard.",
    primaryColor: "green",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-100",
    dotColor: "bg-green-500",
    linkColor: "text-green-600 hover:text-green-700",
    checkboxColor: "text-green-600 accent-green-600 focus:ring-green-500",
  },

  teacher: {
    title: (
      <>
        Priority dining for <br />
        <span className="text-sky-300">our dedicated faculty.</span>
      </>
    ),
    subtitle:
      "Enjoy exclusive menus and priority pickup designed for staff convenience.",
    image: "/images/Background_2.jpg",
    stats: [
      { label: "Faculty Members", value: "200+" },
      { label: "Priority Service", value: "Elite" },
      { label: "Staff Lounges", value: "4+" },
    ],
    welcomeTitle: "Teacher Portal",
    welcomeSubtitle: "Sign in to manage your faculty meal preferences.",
    primaryColor: "blue",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    dotColor: "bg-blue-500",
    linkColor: "text-blue-600 hover:text-blue-700",
    checkboxColor: "text-blue-600 accent-blue-600 focus:ring-blue-500",
  },

  admin: {
    title: (
      <>
        Full control over <br />
        <span className="text-violet-300">campus operations.</span>
      </>
    ),
    subtitle:
      "Manage menus, track performance, and optimize the dining experience.",
    image: "/images/Background_2.jpg",
    stats: [
      { label: "Live Orders", value: "24/7" },
      { label: "Inventory", value: "Smart" },
      { label: "Analytics", value: "Pro" },
    ],
    welcomeTitle: "Admin Console",
    welcomeSubtitle: "Secure access to MealMate operational controls.",
    primaryColor: "indigo",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-100",
    dotColor: "bg-indigo-500",
    linkColor: "text-indigo-600 hover:text-indigo-700",
    checkboxColor: "text-indigo-600 accent-indigo-600 focus:ring-indigo-500",
  },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "student";
  const config = roleConfigs[role] || roleConfigs.student;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });

      const userRole = response.user.role?.toLowerCase();
      if (userRole !== role) {
        toast.error(
          `Access Denied: This is the ${role} portal. You are registered as a ${userRole}.`,
        );
        return;
      }

      login(response.user);
      toast.success(response.message || "Logged in successfully");

      if (response.user.role?.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const leftContent = (
    <div className="flex gap-8">
      {config.stats.map((stat, index) => (
        <React.Fragment key={index}>
          <div>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
            <p className="text-sm font-medium text-white/60">{stat.label}</p>
          </div>
          {index < config.stats.length - 1 && (
            <div className="w-px bg-white/20" />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <AuthLayout
      imageSrc={config.image}
      title={config.title}
      subtitle={config.subtitle}
      extraLeftContent={leftContent}
      role={role}
    >
      <div className="mb-8 text-center lg:text-left">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${config.textColor} text-[10px] font-bold uppercase tracking-wider mb-4 border ${config.borderColor}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`}
          />
          {role} Portal
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {config.welcomeTitle}
        </h2>
        <p className="text-gray-500">{config.welcomeSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
          role={role}
          required
        />

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          role={role}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`text-gray-400 ${config.linkColor} transition-colors duration-200`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className={`w-4 h-4 rounded border-gray-300 ${config.checkboxColor}`}
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className={`text-sm font-semibold ${config.linkColor} transition-colors duration-200`}
          >
            Forgot Password?
          </Link>
        </div>

        <AuthButton type="submit" role={role}>
          Sign In
        </AuthButton>
      </form>

      <p className="text-center text-gray-500 mt-8">
        Don't have an account?{" "}
        <Link
          to={`/SignUp?role=${role}`}
          className={`font-semibold ${config.linkColor} transition-colors duration-200`}
        >
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
