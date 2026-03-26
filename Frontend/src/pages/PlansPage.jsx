import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroSection from "../components/plans/HeroSection";
import PlanCard from "../components/plans/PlanCard";
import { motion, AnimatePresence } from "motion/react";
import SEO from "../components/common/SEO";
import subscriptionService from "../api/services/subscription.service";
import useAuthStore from "../store/useAuthStore";
import { Loader2, Zap, Clock } from "lucide-react";
import toast from "react-hot-toast";

const PlansPage = () => {
  const [planType, setPlanType] = useState("month"); // Default to month
  const [plans, setPlans] = useState([]);
  const [mySubscription, setMySubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useAuthStore();
  const plansRef = useRef(null);
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const plansRes = await subscriptionService.getPlans();
        if (plansRes.success) {
          setPlans(plansRes.data);
        }

        if (isLoggedIn) {
          try {
            const subRes = await subscriptionService.getMySubscription();
            if (subRes.success) {
              setMySubscription(subRes.data);
            }
          } catch (error) {
            if (error.response?.status !== 404) {
              toast.error("Failed to load your subscription. Please refresh.");
            }
            setMySubscription(null);
          }
        }
      } catch (error) {
        console.error("Error loading plans data:", error);
        toast.error("Failed to load plans. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn]);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const currentPlans = plans.filter((p) => p.period === planType);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO 
        title="Meal Plans"
        description="Choose from our flexible weekly and monthly meal plans. Designed for busy lifestyles, our plans offer healthy, chef-prepared meals with zero commitment."
        keywords="meal subscriptions, flexible meal plans, student food plans, healthy eating subscription"
      />
      <Navbar />

      {/* Hero Section Component */}
      <HeroSection scrollToPlans={scrollToPlans} />

      {/* Plans Section */}
      <section ref={plansRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* My Active Subscription Section */}
          <AnimatePresence>
            {isLoggedIn && !isLoading && mySubscription && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-12"
              >
                <div
                  className={`rounded-xl p-8 border-2 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 overflow-hidden relative group ${
                    mySubscription.status === "ACTIVE"
                      ? "bg-linear-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm shadow-green-100/50"
                      : "bg-linear-to-r from-orange-50 to-amber-50 border-orange-200 shadow-sm shadow-orange-100/50"
                  }`}
                >
                  {/* Decorative Background Icon */}
                  <div className="absolute -right-5 -top-5 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Zap size={160} />
                  </div>

                  <div className="flex items-center gap-6 relative z-10">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${
                        mySubscription.status === "ACTIVE"
                          ? "bg-green-600 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      <Zap size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-2xl font-black text-slate-900 leading-none">
                          {mySubscription.plan.name}
                        </h3>
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            mySubscription.status === "ACTIVE"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-orange-100 text-orange-700 border border-orange-200"
                          }`}
                        >
                          {mySubscription.status === "ACTIVE"
                            ? "Active Plan"
                            : "Payment Pending"}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">
                        {mySubscription.remainingMeals} of{" "}
                        {mySubscription.plan.meals} meals remaining • Expires on{" "}
                        {new Date(mySubscription.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                    {mySubscription.status === "PENDING_PAYMENT" && (
                      <p className="text-sm font-semibold text-orange-600 flex items-center gap-2">
                        <Clock size={16} />
                        Waiting for payment confirmation
                      </p>
                    )}
                    {mySubscription.status === "ACTIVE" && (
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Status
                        </p>
                        <p className="text-lg font-black text-green-600 leading-none">
                          Subscription Active
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
            <div className="inline-flex bg-slate-100 rounded-xl p-1.5 relative">
              <button
                onClick={() => setPlanType("week")}
                className={`relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 ${
                  planType === "week"
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {planType === "week" && (
                  <motion.span
                    layoutId="activePlan"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                Weekly Plans
              </button>
              <button
                onClick={() => setPlanType("month")}
                className={`relative z-10 px-8 py-3 rounded-xl font-bold text-sm transition-colors duration-300 ${
                  planType === "month"
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {planType === "month" && (
                  <motion.span
                    layoutId="activePlan"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
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
              {currentPlans.length > 0 ? (
                currentPlans.map((plan, index) => (
                  <PlanCard
                    key={index}
                    plan={plan}
                    isCurrentPlan={mySubscription?.planId === plan.id}
                    hasActiveSub={mySubscription?.status === "ACTIVE"}
                    status={
                      mySubscription?.planId === plan.id
                        ? mySubscription.status
                        : null
                    }
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Zap className="text-slate-200" size={24} />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                    No {planType === "week" ? "Weekly" : "Monthly"} plans found
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlansPage;
