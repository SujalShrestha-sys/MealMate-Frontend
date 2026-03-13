import React from "react";
import { motion } from "motion/react";
import { EASE } from "./constants";

const EmptyState = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4, ease: EASE }}
    className="py-20 flex flex-col items-center text-center"
  >
    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-300">
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-400 max-w-xs">{description}</p>
  </motion.div>
);

export default EmptyState;
