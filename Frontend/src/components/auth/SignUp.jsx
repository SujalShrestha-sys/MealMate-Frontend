import React, { useState, useMemo } from "react";
import { User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthLayout from "./shared/AuthLayout";
import AuthInput from "./shared/AuthInput";
import AuthButton from "./shared/AuthButton";
import toast from "react-hot-toast";
import authService from "../../api/services/auth.service";

const roleConfigs = {
  student: {
    title: (
      <>
        Join the
        <br />
        <span className="text-emerald-300">MealMate family.</span>
      </>
    ),
    subtitle:
      "Create your student account and start ordering fresh meals in minutes.",
    image: "/images/Background_3.jpg",
    benefits: [
      "Skip the canteen queue forever",
      "Pre-order meals ahead of time",
      "Track your daily nutrition",
    ],
    welcomeTitle: "Student Registration",
    welcomeSubtitle: "Join 1000+ students already saving time with MealMate.",
    primaryColor: "green",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    borderColor: "border-green-100",
    dotColor: "bg-green-500",
    linkColor: "text-green-600 hover:text-green-700",
    checkboxColor: "text-green-600 accent-green-600 focus:ring-green-500",
    benefitIcon: "text-emerald-300",
    benefitBg: "bg-emerald-400/20",
    benefitText: "text-green-100/90",
  },
  teacher: {
    title: (
      <>
        Excellence in dining for <br />
        <span className="text-sky-300">our academic staff.</span>
      </>
    ),
    subtitle:
      "Register your faculty account for priority service and exclusive staff menus.",
    image: "/images/Background_3.jpg",
    benefits: [
      "Faculty-exclusive dining areas",
      "Priority pickup windows",
      "Streamlined monthly billing",
    ],
    welcomeTitle: "Faculty Sign Up",
    welcomeSubtitle:
      "Create your professional account for priority campus dining.",
    primaryColor: "blue",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-100",
    dotColor: "bg-blue-500",
    linkColor: "text-blue-600 hover:text-blue-700",
    checkboxColor: "text-blue-600 accent-blue-600 focus:ring-blue-500",
    benefitIcon: "text-sky-300",
    benefitBg: "bg-sky-400/20",
    benefitText: "text-blue-100/90",
  },
  admin: {
    title: (
      <>
        Secure access for <br />
        <span className="text-violet-300">campus administrators.</span>
      </>
    ),
    subtitle:
      "Create your administrative account to oversee dining operations and analytics.",
    image: "/images/Background_3.jpg",
    benefits: [
      "Real-time operations tracking",
      "Menu & vendor management",
      "Advanced data analytics",
    ],
    welcomeTitle: "Admin Registration",
    welcomeSubtitle:
      "Standardized administrative access for dining management.",
    primaryColor: "indigo",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-100",
    dotColor: "bg-indigo-500",
    linkColor: "text-indigo-600 hover:text-indigo-700",
    checkboxColor: "text-indigo-600 accent-indigo-600 focus:ring-indigo-500",
    benefitIcon: "text-violet-300",
    benefitBg: "bg-violet-400/20",
    benefitText: "text-indigo-100/90",
  },
};

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "student";
  const config = roleConfigs[role] || roleConfigs.student;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the Terms of Service");
      return;
    }

    try {
      const response = await authService.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: role,
      });

      toast.success(
        response.message || "Registered successfully! Please login.",
      );
      navigate(`/login?role=${role}`);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Password strength
  const passwordStrength = useMemo(() => {
    const pw = formData.password;
    if (!pw) return { level: 0, label: "", color: "bg-gray-200" };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-400" };
    if (score <= 2) return { level: 2, label: "Fair", color: "bg-orange-400" };
    if (score <= 3) return { level: 3, label: "Good", color: "bg-yellow-400" };
    if (score <= 4) return { level: 4, label: "Strong", color: "bg-green-400" };
    return { level: 5, label: "Very Strong", color: "bg-green-600" };
  }, [formData.password]);

  const leftContent = (
    <div className="flex flex-col gap-4">
      {config.benefits.map((benefit) => (
        <div key={benefit} className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full ${config.benefitBg} flex items-center justify-center shrink-0`}
          >
            <Check size={14} className={config.benefitIcon} />
          </div>
          <span className={`${config.benefitText} text-sm`}>{benefit}</span>
        </div>
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
      <div className="mb-4 text-center lg:text-left">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${config.textColor} text-[10px] font-bold uppercase tracking-wider mb-3 border ${config.borderColor}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`}
          />
          {role} Portal
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">
          {config.welcomeTitle}
        </h2>
        <p className="text-gray-500">{config.welcomeSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <AuthInput
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          icon={User}
          role={role}
          required
        />

        <AuthInput
          label="Email Address"
          type="email"
          name="email"
          placeholder="john@college.edu"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          role={role}
          required
        />

        <AuthInput
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
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

        {/* Password Strength Bar */}
        {formData.password && (
          <div className="flex items-center gap-2 -mt-1">
            <div className="flex-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= passwordStrength.level
                      ? passwordStrength.color
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-500">
              {passwordStrength.label}
            </span>
          </div>
        )}

        <AuthInput
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={Lock}
          role={role}
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`text-gray-400 ${config.linkColor} transition-colors duration-200`}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          required
        />

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className={`w-4 h-4 mt-0.5 rounded border-gray-300 ${config.checkboxColor}`}
            required
          />
          <span className="text-sm text-gray-500 leading-snug">
            I agree to the{" "}
            <a
              href="#"
              className={`font-medium ${config.linkColor} transition-colors duration-200`}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className={`font-medium ${config.linkColor} transition-colors duration-200`}
            >
              Privacy Policy
            </a>
          </span>
        </label>

        <AuthButton type="submit" role={role}>
          Create Account
        </AuthButton>
      </form>
      <p className="text-center text-gray-500 mt-5">
        Already have an account?{" "}
        <Link
          to={`/login?role=${role}`}
          className={`font-semibold ${config.linkColor} transition-colors duration-200`}
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
