import React from "react";

const ItemPills = ({ items }) => (
  <div className="flex flex-wrap gap-1">
    {items.map((item, i) => (
      <span
        key={i}
        className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full text-[11px] font-bold text-slate-500 border border-green-100"
      >
        <span className="text-green-600 font-semibold">{item.quantity}×</span>
        {item.dish.name}
      </span>
    ))}
  </div>
);

export default ItemPills;
