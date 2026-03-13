import React from "react";
import { motion } from "framer-motion";

export const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2].map((i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 0.4, 0.6] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.1,
        }}
        className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row gap-6"
      >
        <div className="flex gap-3.5 items-start flex-1">
          <div className="shrink-0 w-16 h-16 rounded-xl bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-20 bg-slate-50 rounded" />
            <div className="h-5 w-40 bg-slate-100 rounded" />
            <div className="h-3 w-32 bg-slate-50 rounded" />
          </div>
        </div>
        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2">
          <div className="h-4 w-16 bg-slate-50 rounded" />
          <div className="h-6 w-24 bg-slate-100 rounded" />
        </div>
      </motion.div>
    ))}
  </div>
);