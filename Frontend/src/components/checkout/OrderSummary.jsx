import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

const OrderSummary = ({ subtotal, selectedSlot, children }) => {
  const tax = subtotal * 0.05; // 5% example
  const grandTotal = subtotal + tax;

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col h-full"
    >
      <h2 className="text-base font-bold text-slate-900 mb-4 px-1 uppercase tracking-widest">Order Summary</h2>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex justify-between items-center text-sm px-1">
          <span className="font-bold text-slate-400 uppercase tracking-tight">Subtotal</span>
          <span className="font-bold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm px-1">
          <span className="font-bold text-slate-400 uppercase tracking-tight">Taxes</span>
          <span className="font-bold text-slate-900">Rs. {tax.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-sm px-1 pt-2">
          <span className="font-bold text-slate-400 uppercase tracking-tight">Pickup Slot</span>
          <span className={`font-bold transition-colors ${selectedSlot ? 'text-green-600' : 'text-slate-300'}`}>
            {selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}` : 'Not Selected'}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100 mt-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">Total</span>
            <span className="text-2xl font-bold text-green-600">
              Rs. {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
};

export default OrderSummary;
