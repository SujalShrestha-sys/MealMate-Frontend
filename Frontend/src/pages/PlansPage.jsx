import React, { useState, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroSection from "../components/plans/HeroSection";
import PlanCard from "../components/plans/PlanCard";
import { motion, AnimatePresence } from "motion/react";

const PlansPage = () => {
  const [planType, setPlanType] = useState("weekly");
  const plansRef = useRef(null);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const weeklyPlans = [
    {
      name: "Weekly Veg Delight",
      price: 25,
      period: "week",
      description: "Perfect for vegetarians who want fresh, healthy meals",
      meals: 5,
      features: [
        "5 Vegetarian Lunches",
        "Fresh, local ingredients",
        "Daily drink included",
        "Customizable menu",
      ],
      popular: false,
    },
    {
      name: "Weekly Basic",
      price: 30,
      period: "week",
      description: "Great starter plan for busy students",
      meals: 5,
      features: [
        "5 Lunches",
        "Standard meal rotation",
        "Save 5% vs daily",
        "Flexible delivery",
      ],
      popular: false,
    },
    {
      name: "Weekly Power Pack",
      price: 35,
      period: "week",
      description: "Most popular choice for active students",
      meals: 5,
      features: [
        "5 Lunches",
        "Breakfast add-on option",
        "Save over 10%",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Weekly Premium",
      price: 45,
      period: "week",
      description: "Premium experience with gourmet selections",
      meals: 5,
      features: [
        "5 Premium Lunches",
        "Gourmet meal choices",
        "Includes dessert",
        "VIP treatment",
      ],
      popular: false,
    },
  ];

  const monthlyPlans = [
    {
      name: "Monthly Veg Delight",
      price: 95,
      period: "month",
      description: "Perfect for vegetarians who want fresh, healthy meals",
      meals: 20,
      features: [
        "20 Vegetarian Lunches",
        "Fresh, local ingredients",
        "Daily drink included",
        "Customizable menu",
      ],
      popular: false,
    },
    {
      name: "Monthly Basic",
      price: 115,
      period: "month",
      description: "Great starter plan for busy students",
      meals: 20,
      features: [
        "20 Lunches",
        "Standard meal rotation",
        "Save 10% vs daily",
        "Flexible delivery",
        "Pre-order priority",
      ],
      popular: false,
    },
    {
      name: "Monthly Power Pack",
      price: 120,
      period: "month",
      description: "Most popular choice for active students",
      meals: 20,
      features: [
        "20 Lunches",
        "Breakfast add-on option",
        "Save over 15%",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Monthly Premium",
      price: 150,
      period: "month",
      description: "Premium experience with gourmet selections",
      meals: 20,
      features: [
        "20 Premium Lunches",
        "Gourmet meal choices",
        "Includes dessert",
        "VIP treatment",
      ],
      popular: false,
    },
  ];

  const currentPlans = planType === "weekly" ? weeklyPlans : monthlyPlans;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section Component */}
      <HeroSection scrollToPlans={scrollToPlans} />

      {/* Plans Section */}
      <section ref={plansRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-gray-600">
              Flexible plans designed for student life
            </p>
          </div>

          {/* Plan Type Toggle */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex bg-slate-100 rounded-2xl p-1.5 relative">
              <button
                onClick={() => setPlanType("weekly")}
                className={`relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 ${
                  planType === "weekly"
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {planType === "weekly" && (
                  <motion.span
                    layoutId="activePlan"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                Weekly Plans
              </button>
              <button
                onClick={() => setPlanType("monthly")}
                className={`relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 ${
                  planType === "monthly"
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {planType === "monthly" && (
                  <motion.span
                    layoutId="activePlan"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                Monthly Plans
              </button>
            </div>
          </div>

          {/* Plan Cards Grid with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={planType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {currentPlans.map((plan, index) => (
                <PlanCard key={index} plan={plan} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlansPage;
