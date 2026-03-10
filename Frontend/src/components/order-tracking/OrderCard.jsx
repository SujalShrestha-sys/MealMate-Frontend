import React from "react";
import { motion } from "motion/react";
import OrderStatusStepper from "./OrderStatusStepper";

const OrderCard = ({ order }) => {
  const mainDish = order.items[0]?.dish;

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
      className="bg-white rounded-3xl p-6 md:p-7 border border-slate-100 hover:border-slate-200 hover:shadow-[0_20px_40px_-15px_rgba(30,41,59,0.05)] transition-all duration-500 group relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-6">
        {/* Left: Image (Clean border) */}
        <motion.div
          variants={itemVariants}
          className="w-24 h-24 md:w-28 md:h-28 rounded-[1.25rem] overflow-hidden shrink-0 border border-slate-50 group-hover:scale-105 transition-transform duration-700"
        >
          <img
            src={mainDish?.imageUrl}
            alt={mainDish?.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Middle: Details (Balanced Typography) */}
        <motion.div
          variants={itemVariants}
          className="flex-1 min-w-0 space-y-2 text-center md:text-left"
        >
          <div className="space-y-2">
            <h3 className="text-xl md:text-xl font-bold text-slate-800 transition-colors leading-tight tracking-tight">
              {mainDish?.name}
            </h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Ref: #{order.id.slice(0, 5).toUpperCase()}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            {order.items.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-100/50"
              >
                <span className="text-emerald-600 font-bold text-xs">
                  {item.quantity}x
                </span>
                <span className="text-slate-500 text-[11px] font-semibold truncate max-w-[120px]">
                  {item.dish.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Middle-Right: Slider (Minimalist) */}
        <motion.div
          variants={itemVariants}
          className="hidden lg:block w-56 xl:w-72 px-4 pt-2"
        >
          <OrderStatusStepper status={order.status} />
        </motion.div>

        {/* Right: Status & Price (Refined Currency) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center md:items-end justify-center gap-4 pl-0 md:pl-10 border-t md:border-t-0 md:border-l border-slate-50 pt-2 md:pt-0"
        >
          <div className="text-center md:text-right">
            <p className="text-2xl md:text-2xl font-bold text-slate-700 tracking-tight leading-none">
              <span className="text-slate-600 font-medium">Rs.</span>{" "}
              {order.totalAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">
              {order.payment?.method || "CASH"}
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
              {order.status === "PENDING"
                ? "Processing"
                : order.status === "PREPARING"
                  ? "Kitchen hand-crafting"
                  : order.status === "READY"
                    ? "Ready for handover"
                    : "Completed"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Mobile-only slider display */}
      <motion.div variants={itemVariants} className="lg:hidden mt-8 px-4">
        <OrderStatusStepper status={order.status} isMobile />
      </motion.div>
    </motion.div>
  );
};

export default OrderCard;
