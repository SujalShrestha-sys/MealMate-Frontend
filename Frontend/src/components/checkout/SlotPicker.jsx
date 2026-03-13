import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, CheckCircle2, Calendar, Loader2 } from "lucide-react";
import pickupSlotService from "../../api/services/pickupSlot.service";

const SlotPicker = ({ selectedSlot, onSelectSlot }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real slots from API
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const response = await pickupSlotService.getSlots();
        if (response.success) {
          setSlots(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch pickup slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  // Format time from ISO string
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format date from ISO string
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Check if a slot is expired
  const isExpired = (slot) => {
    if (!slot.endTime) return false;
    const now = new Date();
    const expiryTime = new Date(slot.endTime);
    return expiryTime <= now;
  };

  // Filter: only show active (non-expired) slots
  const activeSlots = slots.filter((slot) => !isExpired(slot));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
          <Calendar size={18} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Schedule Pickup
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            {activeSlots.length} available timeframes
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-green-600" />
        </div>
      )}

      {/* Empty State */}
      {!loading && activeSlots.length === 0 && (
        <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Clock size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-bold text-slate-500">
            No pickup slots available right now
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Check back later — new slots are added daily.
          </p>
        </div>
      )}

      {/* Slot List */}
      {!loading && activeSlots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {activeSlots.map((slot, index) => {
              const isSelected = selectedSlot?.id === slot.id;

              return (
                <motion.button
                  key={slot.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectSlot(slot)}
                  className={`
                    relative group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left
                    ${
                      isSelected
                        ? "bg-green-50 border-green-600 shadow-sm"
                        : "bg-white border-slate-100 hover:border-green-100 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                      ${
                        isSelected
                          ? "bg-green-600 text-white"
                          : "bg-slate-50 text-slate-400 group-hover:text-green-600"
                      }
                    `}
                    >
                      <Clock size={16} />
                    </div>
                    <div>
                      <h5
                        className={`font-bold text-sm ${
                          isSelected ? "text-green-700" : "text-slate-900"
                        }`}
                      >
                        {formatTime(slot.startTime)} –{" "}
                        {formatTime(slot.endTime)}
                      </h5>
                      <p
                        className={`text-[10px] font-bold ${
                          isSelected ? "text-green-600" : "text-slate-400"
                        }`}
                      >
                        {formatDate(slot.startTime)} · max {slot.maxOrders}{" "}
                        orders
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
      )}
    </motion.div>
  );
};

export default SlotPicker;
