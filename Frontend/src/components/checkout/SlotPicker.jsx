import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";

const SlotPicker = ({ selectedSlot, onSelectSlot }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const slots = [
    {
      id: 1,
      startTime: "2026-03-07T12:00:00.000Z",
      endTime: "2026-03-07T12:15:00.000Z",
      maxOrders: 15,
      currentOrders: 5,
    },
    {
      id: 2,
      startTime: "2026-03-07T12:15:00.000Z",
      endTime: "2026-03-07T12:30:00.000Z",
      maxOrders: 15,
      currentOrders: 15,
    },
    {
      id: 3,
      startTime: "2026-03-07T12:30:00.000Z",
      endTime: "2026-03-07T12:45:00.000Z",
      maxOrders: 15,
      currentOrders: 8,
    },
    {
      id: 4,
      startTime: "2026-03-07T12:45:00.000Z",
      endTime: "2026-03-07T13:00:00.000Z",
      maxOrders: 15,
      currentOrders: 2,
    },
  ];

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const renderCalendar = () => {
    const today = new Date().getDate();
    return (
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h4 className="text-base font-bold text-slate-900 tracking-tight">
              March 2026
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Pickup date
            </p>
          </div>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-green-600 transition-colors border border-slate-100 shadow-sm">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:text-green-600 transition-colors border border-slate-100 shadow-sm">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <div
              key={d}
              className="text-[9px] font-bold text-slate-300 text-center uppercase tracking-widest"
            >
              {d}
            </div>
          ))}

          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
            const isSelected = day === selectedDate.getDate();
            const isToday = day === today;

            return (
              <div key={day} className="flex justify-center items-center">
                <motion.button
                  onClick={() => {
                    const newDate = new Date();
                    newDate.setDate(day);
                    setSelectedDate(newDate);
                  }}
                  className={`
                    relative w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200
                    ${
                      isSelected
                        ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                        : "text-slate-600 hover:bg-green-500/10 hover:text-green-600"
                    }
                  `}
                >
                  {day}
                  {isToday && !isSelected && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full" />
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
          <Calendar size={18} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Schedule Pickup
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Available timeframes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="w-full">{renderCalendar()}</div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            Available Windows
          </h4>

          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence mode="popLayout">
              {slots.map((slot, index) => {
                const isFull = slot.currentOrders >= slot.maxOrders;
                const isSelected = selectedSlot?.id === slot.id;

                return (
                  <motion.button
                    key={slot.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    disabled={isFull}
                    onClick={() => onSelectSlot(slot)}
                    className={`
                      relative group flex items-center justify-between p-3 rounded-xl border transition-all duration-200
                      ${
                        isSelected
                          ? "bg-green-50 border-green-600 shadow-sm"
                          : isFull
                            ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
                            : "bg-white border-slate-100 hover:border-green-100 hover:bg-slate-50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                        ${isSelected ? "bg-green-600 text-white" : "bg-slate-50 text-slate-400 group-hover:text-green-600"}
                      `}
                      >
                        <Clock size={14} />
                      </div>
                      <div className="text-left">
                        <h5
                          className={`font-bold text-sm ${isSelected ? "text-green-700" : "text-slate-900"}`}
                        >
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </h5>
                        <p
                          className={`text-[10px] font-bold ${isSelected ? "text-green-600" : isFull ? "text-red-400" : "text-slate-400"}`}
                        >
                          {isFull
                            ? "Sold Out"
                            : `${slot.maxOrders - slot.currentOrders} left`}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 size={20} className="text-green-600" />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SlotPicker;
