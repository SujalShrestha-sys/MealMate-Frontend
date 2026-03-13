import React from "react";
import { motion } from "motion/react";
import OrderStatusStepper from "./OrderStatusStepper";
import MetaRow from "./MetaRow";
import ItemPills from "./ItemPills";
import StatusBadge from "./StatusBadge";
import PriceBlock from "./PriceBlock";
import { formatDate, getDisplayId } from "./constants";

const OrderCard = ({ order, index = 0 }) => {
  const mainDish = order.items[0]?.dish;
  const isCancelled = order.status === "CANCELLED";
  const isActive = order.status !== "COMPLETED" && !isCancelled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4, 
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.06)" 
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.05
      }}
      className="bg-white rounded-lg border border-slate-100 shadow-md overflow-hidden group"
    >
      {/* Body */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          {/* Left: Image + Details */}
          <div className="flex gap-3.5 items-start flex-1 min-w-0">
            <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
              <motion.img
                src={mainDish?.imageUrl}
                alt={mainDish?.name}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <MetaRow displayId={getDisplayId(order)} orderDate={formatDate(order.createdAt)} />
              <h3 className="text-xl sm:text-lg font-medium text-slate-800 tracking-tight leading-loose">
                {mainDish?.name}
              </h3>
              <ItemPills items={order.items} />
            </div>
          </div>

          {/* Right: Price + Status */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:gap-4 sm:min-w-[120px] pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
            <PriceBlock payment={order.payment} totalAmount={order.totalAmount} />
            <StatusBadge status={order.status} isActive={isActive} />
          </div>
        </div>
      </div>

      {/* Stepper */}
      {!isCancelled && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <div className="pt-3 border-t border-slate-100/80">
            <OrderStatusStepper status={order.status} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderCard;
