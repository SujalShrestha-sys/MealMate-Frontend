import React from "react";
import { ArrowRight, Star, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const PromoBanner = () => {
  return (
    <section className="w-full mb-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white border-y border-slate-100"
      >
        {/* Modern Accent Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-green-50/50 -skew-x-12 translate-x-1/4" />
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px] opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center py-12 lg:py-16">
            {/* LEFT SIDE: Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest"
              >
                <Sparkles size={12} />
                <span>Premium Quality</span>
              </motion.div>

              <div className="space-y-3">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
                >
                  Gourmet Dining, <br />
                  <span className="text-green-600">Reimagined.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-slate-500 text-base md:text-lg max-w-lg font-medium"
                >
                  Experience the finest campus meals with MealMate. Pre-order
                  now to enjoy fresh ingredients and zero wait time.
                </motion.p>
              </div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <button className="group inline-flex items-center gap-2 bg-green-600 text-white px-7 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-green-600/10 hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98]">
                  Order Ahead
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <button className="inline-flex items-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 px-7 py-3.5 rounded-xl font-bold transition-all hover:bg-white hover:border-slate-300">
                  Meal Plans
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 lg:flex lg:flex-wrap gap-2 sm:gap-4 pt-5"
              >
                {[
                  { icon: <Star size={16} />, label: "Top Rated" },
                  { icon: <Clock size={16} />, label: "Express Pickup" },
                  { icon: <ShieldCheck size={16} />, label: "Freshly Made" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-3 px-2 sm:px-4 py-3 bg-slate-50 border border-slate-100 rounded-md text-slate-600 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm text-center sm:text-left"
                  >
                    <span className="text-green-600 shrink-0">{item.icon}</span>
                    <span className="leading-tight">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT SIDE: Imagery (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 max-w-md mx-auto">
                {/* Main Food Image with sleek frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="absolute inset-0 z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
                >
                  <img
                    src="/images/gourmet_burger.png"
                    alt="Signature Burger"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </motion.div>

                {/* Overlapping secondary element */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute -bottom-6 -right-6 z-20 w-32 md:w-40 aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl"
                >
                  <img
                    src="/images/healthy_salad.png"
                    alt="Fresh Salad"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Sleek Floating stat card */}
                <motion.div
                  initial={{ opacity: 0, x: -20, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -top-4 -left-4 z-20 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-100/50 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">
                      Avg. Prep Time
                    </p>
                    <p className="text-slate-900 font-extrabold text-sm leading-none">
                      8 Minutes
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PromoBanner;
