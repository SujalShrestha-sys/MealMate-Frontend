import React from "react";
import { motion } from "motion/react";
import { TABS } from "./constants";

const TabSwitcher = ({ activeTab, setActiveTab, counts }) => (
  <div className="flex p-1 bg-white rounded-lg border border-slate-100 shadow-sm w-full sm:w-fit">
    {TABS.map((tab) => {
      const count = counts[tab.id] || 0;
      const isActive = activeTab === tab.id;
      const TabIcon = tab.icon;

      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-md text-sm font-semibold ${
            isActive ? "text-green-700" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {isActive && (
            <motion.span
              layoutId="activeTab"
              className="absolute inset-0 bg-green-50 border border-green-100/60 rounded-md -z-10"
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            />
          )}
          <TabIcon size={15} strokeWidth={2.2} />
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.mobileLabel}</span>
          {count > 0 && (
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                isActive ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default TabSwitcher;
