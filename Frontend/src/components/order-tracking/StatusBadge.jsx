import React from "react";
import { STATUS_LABELS } from "./constants";

const StatusBadge = ({ status, isActive }) => (
  <div className="flex items-center gap-1.5 border-green-600 rounded-full px-2 py-1 bg-green-50">
    {isActive && (
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-30" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600" />
      </span>
    )}
    <span className="text-[12px] font-semibold tracking-wider text-green-700">
      {STATUS_LABELS[status] || status}
    </span>
  </div>
);

export default StatusBadge;
