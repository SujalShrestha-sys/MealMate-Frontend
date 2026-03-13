import React from "react";
import { motion } from "motion/react";
import { EASE } from "./constants";

const HistoryRow = ({ order, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ 
      x: 4, 
      backgroundColor: "rgba(248, 250, 252, 0.8)",
      borderColor: "rgba(34, 197, 94, 0.2)"
    }}
    transition={{ duration: 0.35, ease: EASE, delay: index * 0.04 }}
    className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer"
  >
    <div className="flex items-center gap-3.5">
      <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
        <img
          src={order.items[0]?.dish?.imageUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          alt=""
        />
      </div>
      <div className="space-y-0.5">
        <h4 className="font-semibold text-slate-900 text-sm tracking-tight group-hover:text-green-700 transition-colors duration-200">
          {order.items[0]?.dish?.name}
        </h4>
        <p className="text-[10px] text-slate-400 font-medium">
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
    <div className="text-right flex items-center gap-4">
      <p className="font-bold text-slate-900 text-base tracking-tight">
        <span className="text-slate-400 font-medium text-xs mr-0.5">Rs.</span>
        {order.totalAmount.toLocaleString()}
      </p>
      <span
        className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
          order.status === "COMPLETED"
            ? "text-green-600 bg-green-50 border-green-100"
            : "text-slate-400 bg-slate-50 border-slate-100"
        }`}
      >
        {order.status === "COMPLETED" ? "Completed" : "Cancelled"}
      </span>
    </div>
  </motion.div>
);

export default HistoryRow;
