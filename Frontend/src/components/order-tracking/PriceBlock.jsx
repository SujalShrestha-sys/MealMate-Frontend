import React from "react";
import { CreditCard } from "lucide-react";

const PriceBlock = ({ payment, totalAmount }) => (
  <>
    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
      <CreditCard size={12} strokeWidth={3} />
      {payment?.method || "Cash"}
    </div>
    <p className="text-xl sm:text-xl font-semibold text-slate-800 tracking-tight leading-none">
      <span className="text-slate-400 font-medium text-[12px] mr-0.5">Rs.</span>
      {totalAmount.toLocaleString()}
    </p>
  </>
);

export default PriceBlock;
