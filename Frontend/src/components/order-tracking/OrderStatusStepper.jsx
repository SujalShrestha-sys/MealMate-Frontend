import React from "react";
import { motion } from "motion/react";
import { Check, ChefHat, Package, Clock, CircleCheckBig } from "lucide-react";


const STEPS = [
  { id: "PENDING", label: "Placed", icon: Clock },
  { id: "CONFIRMED", label: "Confirmed", icon: Check },
  { id: "PREPARING", label: "Preparing", icon: ChefHat },
  { id: "READY_FOR_PICKUP", label: "Ready", icon: Package },
  { id: "COMPLETED", label: "Done", icon: CircleCheckBig },
];

const getState = (index, effectiveIndex, isFinalized) => {
  if (isFinalized || index < effectiveIndex) return "finished";
  if (index === effectiveIndex) return "current";
  return "upcoming";
};

const StepNode = ({ step, state, size = "md" }) => {
  const StepIcon = step.icon;
  const dim = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconPx = size === "sm" ? 11 : 14;

  const colors = {
    finished: { bg: "#16a34a", text: "#ffffff", border: "#16a34a" },
    current: { bg: "#ffffff", text: "#10b981", border: "#10b981" },
    upcoming: { bg: "#f8fafc", text: "#cbd5e1", border: "#e2e8f0" },
  };

  return (
    <motion.div 
      animate={{ 
        backgroundColor: colors[state].bg,
        borderColor: colors[state].border,
        color: colors[state].text,
        scale: state === "current" ? 1.1 : 1
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`${dim} rounded-full flex items-center justify-center shrink-0 border-2`}
    >
      {state === "finished" ? (
        <Check size={iconPx} strokeWidth={2.5} />
      ) : (
        <StepIcon size={iconPx} strokeWidth={2} />
      )}
    </motion.div>
  );
};

const HorizontalStepper = ({ effectiveIndex, isFinalized }) => {
  const labelColor = {
    finished: "text-green-600/70",
    current: "text-green-700",
    upcoming: "text-slate-300",
  };

  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => {
        const state = getState(i, effectiveIndex, isFinalized);
        const filled = isFinalized || i < effectiveIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2 min-w-0">
              <StepNode step={step} state={state} />
              <span className={`text-[11px] font-semibold whitespace-nowrap ${labelColor[state]}`}>
                {step.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 mt-4 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-500 rounded-full origin-left"
                  initial={false}
                  animate={{ scaleX: filled ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Mobile: Vertical
const VerticalStepper = ({ effectiveIndex, isFinalized }) => {
  const labelColor = {
    finished: "text-slate-500",
    current: "text-green-700",
    upcoming: "text-slate-300",
  };

  return (
    <div className="flex flex-col">
      {STEPS.map((step, i) => {
        const state = getState(i, effectiveIndex, isFinalized);
        const isLast = i === STEPS.length - 1;
        const filled = isFinalized || i < effectiveIndex;

        return (
          <div key={step.id} className="flex items-stretch gap-3">
            <div className="flex flex-col items-center">
              <StepNode step={step} state={state} size="sm" />
              {!isLast && (
                <div className={`w-[2px] flex-1 min-h-[16px] rounded-full ${filled ? "bg-green-400" : "bg-slate-100"}`} />
              )}
            </div>
            <div className={isLast ? "" : "pb-3"}>
              <span className={`text-xs font-semibold leading-6 ${labelColor[state]}`}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

//Main
const OrderStatusStepper = ({ status }) => {
  const idx = STEPS.findIndex((s) => s.id === status);
  const effectiveIndex = status === "CANCELLED" ? -1 : idx;
  const isFinalized = status === "COMPLETED";

  return (
    <div className="w-full select-none">
      <div className="hidden sm:block">
        <HorizontalStepper effectiveIndex={effectiveIndex} isFinalized={isFinalized} />
      </div>
      <div className="sm:hidden">
        <VerticalStepper effectiveIndex={effectiveIndex} isFinalized={isFinalized} />
      </div>
    </div>
  );
};

export default OrderStatusStepper;
