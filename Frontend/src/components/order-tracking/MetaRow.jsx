import React from "react";
import { Hash, Clock } from "lucide-react";

const MetaRow = ({ displayId, orderDate }) => (
  <div className="flex items-center gap-2 text-slate-400 text-[12px]">
    <span className="flex items-center gap-1">
      <Hash size={10} strokeWidth={2.5} />
      <span className="font-semibold tracking-wide uppercase">{displayId}</span>
    </span>
    <span className="text-slate-200">·</span>
    <span className="flex items-center gap-1">
      <Clock size={10} strokeWidth={2} />
      <span className="font-medium">{orderDate}</span>
    </span>
  </div>
);

export default MetaRow;
