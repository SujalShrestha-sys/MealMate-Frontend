import React from "react";
import { motion } from "motion/react";

const OrderStatusStepper = ({ status, isMobile = false }) => {
  const steps = [
    { id: "PENDING", label: "Pickup" },
    { id: "PREPARING", label: "In Work" },
    { id: "READY", label: "Ready" },
    { id: "COMPLETED", label: "Done" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === status);

  return (
    <div className={`w-full ${isMobile ? "py-6 px-2" : "py-4 px-1"}`}>
      <div className="relative flex items-center justify-between">
        {/* Background Track - Ultra Minimal */}
        {/* Background Track - Ultra Minimal */}
        <div
          className={`absolute left-0 top-1/2 w-full -translate-y-1/2 bg-slate-100/60 rounded-full ${isMobile ? "h-[2.5px]" : "h-[2.5px]"}`}
        />

        {/* Active Progress - Clean Emerald */}
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-emerald-500 transition-all duration-1000 ease-out rounded-full ${isMobile ? "h-0.5" : "h-[2.5px]"}`}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor:
                    isCompleted || isActive ? "#10b981" : "#f1f5f9",
                  borderColor: isCompleted || isActive ? "#10b981" : "#e2e8f0",
                  scale: isActive ? (isMobile ? 1.3 : 1.3) : 1,
                }}
                className={`flex items-center justify-center rounded-full border transition-all duration-700 z-10 ${
                  isMobile ? "h-2.5 w-2.5" : "h-3 w-3"
                } ${isCompleted ? "bg-emerald-500 border-emerald-500" : ""}`}
              />

              <div
                className={`absolute flex flex-col items-center ${isMobile ? "-top-9" : "-top-10"}`}
              >
                <span
                  className={`font-bold uppercase tracking-[0.14em] whitespace-nowrap transition-all duration-500 ${
                    isMobile ? "text-[11px]" : "text-[11px]"
                  } ${
                    isActive
                      ? "text-emerald-600/90"
                      : isCompleted
                        ? "text-slate-500"
                        : "text-slate-300"
                  }`}
                >
                  {step.label}
                </span>

                {isActive && (
                  <motion.div
                    className={`${isMobile ? "w-1 h-1" : "w-1 h-1"} bg-emerald-500 rounded-full mt-2 blur-[1px]`}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusStepper;
