import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Wallet, Landmark, CheckCircle2 } from "lucide-react";

const PaymentMethods = ({
  onPayKhalti,
  onPayCash,
  onPaySubscription,
  subscription,
  disabled,
  selectedMethod,
  onMethodChange,
}) => {
  const hasSub =
    subscription &&
    subscription.status === "ACTIVE" &&
    subscription.remainingMeals > 0;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2 px-1">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Payment
        </p>
      </div>

      <div className={`grid gap-2 ${hasSub ? "grid-cols-3" : "grid-cols-2"}`}>
        {/* Subscription Button */}
        {hasSub && (
          <motion.button
            disabled={disabled}
            onClick={() => onMethodChange("subscription")}
            className={`relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${
              selectedMethod === "subscription"
                ? "bg-purple-50 border-purple-600 text-purple-700"
                : "bg-white border-slate-100 hover:border-purple-600/30 text-slate-600 hover:bg-purple-50/10"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                selectedMethod === "subscription"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                  : "bg-slate-50"
              }`}
            >
              <ShieldCheck
                size={18}
                className={
                  selectedMethod === "subscription"
                    ? "text-white"
                    : "text-slate-400 group-hover:text-purple-600"
                }
              />
            </div>
            <span className="text-[10px] font-bold tracking-tight uppercase">
              Plan
            </span>
            <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
              {subscription.remainingMeals}
            </div>
            {selectedMethod === "subscription" && (
              <div className="absolute bottom-1 right-1">
                <CheckCircle2 size={10} className="text-purple-600" />
              </div>
            )}
          </motion.button>
        )}
        {/* Khalti Button */}
        <motion.button
          disabled={disabled}
          onClick={() => onMethodChange("khalti")}
          className={`relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${
            selectedMethod === "khalti"
              ? "bg-green-50 border-green-600 text-green-700"
              : "bg-white border-slate-100 hover:border-green-600/30 text-slate-600 hover:bg-green-50/10"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
              selectedMethod === "khalti"
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "bg-slate-50"
            }`}
          >
            <Landmark
              size={18}
              className={
                selectedMethod === "khalti"
                  ? "text-white"
                  : "text-slate-400 group-hover:text-green-600"
              }
            />
          </div>
          <span className="text-[11px] font-bold tracking-tight uppercase">
            Khalti
          </span>
          {selectedMethod === "khalti" && (
            <div className="absolute top-1.5 right-1.5">
              <CheckCircle2 size={12} className="text-green-600" />
            </div>
          )}
        </motion.button>

        {/* Cash Button */}
        <motion.button
          disabled={disabled}
          onClick={() => onMethodChange("cash")}
          className={`relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${
            selectedMethod === "cash"
              ? "bg-amber-50 border-amber-600 text-amber-700"
              : "bg-white border-slate-100 hover:border-amber-600/30 text-slate-600 hover:bg-amber-50/10"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
              selectedMethod === "cash"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                : "bg-slate-50"
            }`}
          >
            <Wallet
              size={18}
              className={
                selectedMethod === "cash"
                  ? "text-white"
                  : "text-slate-400 group-hover:text-amber-600"
              }
            />
          </div>
          <span className="text-[11px] font-bold tracking-tight uppercase">
            Cash
          </span>
          {selectedMethod === "cash" && (
            <div className="absolute top-1.5 right-1.5">
              <CheckCircle2 size={12} className="text-amber-600" />
            </div>
          )}
        </motion.button>
      </div>

      <motion.button
        key={selectedMethod}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        disabled={disabled}
        onClick={
          selectedMethod === "khalti"
            ? onPayKhalti
            : selectedMethod === "subscription"
              ? onPaySubscription
              : onPayCash
        }
        className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 uppercase tracking-widest ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${
          selectedMethod === "khalti"
            ? "bg-green-600 text-white hover:bg-green-700"
            : selectedMethod === "subscription"
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-amber-600 text-white hover:bg-amber-700"
        }`}
      >
        {selectedMethod === "khalti" ? (
          <>
            <Landmark size={18} />
            Pay with Khalti
          </>
        ) : selectedMethod === "subscription" ? (
          <>
            <ShieldCheck size={18} />
            Use Subscription Meal
          </>
        ) : (
          <>
            <Wallet size={18} />
            Pay with Cash on Pickup
          </>
        )}
      </motion.button>

      <p className="text-[10px] text-center text-slate-400 font-medium px-4">
        {selectedMethod === "khalti"
          ? "Quick and secure checkout via Khalti gateway."
          : selectedMethod === "subscription"
            ? "Apply one of your pre-paid subscription meals."
            : "Simple and reliable payment on pickup."}
      </p>
    </div>
  );
};

export default PaymentMethods;
