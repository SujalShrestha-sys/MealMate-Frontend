import React from "react";
import { Shield, CheckCircle, Clock, Sparkles, ArrowDown } from "lucide-react";
import { motion } from "motion/react";

const HeroSection = ({ scrollToPlans }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -3 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const floatingVariants = {
    hidden: { opacity: 0, x: 20, y: 20 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="pt-32 pb-24 relative overflow-hidden bg-white">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50/30 skew-x-[-15deg] translate-x-1/2 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* LEFT SIDE: Content (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 text-green-700 text-[10px] font-bold uppercase tracking-widest border border-green-100"
            >
              <Sparkles size={12} />
              <span>Smart Student Living</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                variants={itemVariants}
                className="text-3xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
              >
                Eat Well. <br />
                <span className="text-green-600">Save More.</span> <br />
                Focus Better.
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-slate-500 text-lg md:text-lg max-w-xl font-medium leading-relaxed"
              >
                Our curated meal plans are designed specifically for the campus
                lifestyle. Save up to 20% on your daily dining while enjoying
                gourmet quality.
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <button
                onClick={scrollToPlans}
                className="group inline-flex items-center gap-2 bg-green-600 text-white px-5 py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-600/10 hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                View Plans
                <ArrowDown
                  size={18}
                  className="group-hover:translate-y-1 transition-transform"
                />
              </button>

              <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="User"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-600">
                  <span className="text-slate-900">500+</span> Students Joined
                </div>
              </div>
            </motion.div>

            {/* Refined Trust indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-slate-100"
            >
              {[
                { icon: <CheckCircle size={16} />, label: "Fresh Daily" },
                { icon: <Clock size={16} />, label: "Zero Queues" },
                { icon: <Shield size={16} />, label: "Secured Billing" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-slate-400 text-[11px] font-bold uppercase tracking-widest"
                >
                  <span className="text-green-600">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT SIDE: Imagery (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative rings behind image */}
              <div className="absolute inset-0 border-2 border-dashed border-green-500/10 rounded-full animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-4 border border-slate-100 rounded-full" />

              {/* Main Image with professional framing */}
              <motion.div
                variants={imageVariants}
                className="absolute inset-10 z-10 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-8 border-white"
              >
                <img
                  src="/images/plans_hero.png"
                  alt="Meal Prep Selection"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Sophisticated Floating card */}
              <motion.div
                variants={floatingVariants}
                className="absolute -bottom-2 right-0 lg:-right-4 z-20 bg-white/90 backdrop-blur-md p-4 lg:p-5 rounded-2xl lg:rounded-3xl shadow-2xl border border-white/50 flex flex-col gap-3 lg:gap-4 max-w-40 lg:max-w-[200px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Quality Guaranteed
                    </p>
                    <p className="text-slate-900 font-bold text-sm tracking-tight leading-none">
                      Catering Grade
                    </p>
                  </div>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex justify-between items-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    User Satisfaction
                  </div>
                  <div className="text-green-600 font-black text-sm">4.9/5</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
