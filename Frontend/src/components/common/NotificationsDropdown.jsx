import React, { useRef, useEffect } from "react";
import { Bell, MessageSquare, Trash2, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import useNotificationStore from "../../store/useNotificationStore";

const NotificationsDropdown = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    fetchNotifications,
    isLoading,
  } = useNotificationStore();

  const dropdownRef = useRef(null);

  // Fetch notifications when opened
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 mt-3 w-80 md:w-96 bg-white/95 backdrop-blur-xl rounded-[24px] border border-slate-100 shadow-2xl z-[100] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-white/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    title="Mark all as read"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAllNotifications();
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Clear all"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading && notifications.length === 0 ? (
              <div className="py-12 flex justify-center items-center">
                <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                  <Bell size={20} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">No notifications yet</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notif)}
                    className={`px-6 py-4 flex gap-4 transition-colors hover:bg-slate-50 relative group cursor-pointer ${!notif.isRead ? "bg-green-50/30" : ""}`}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${!notif.isRead ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}
                      >
                        <MessageSquare size={18} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 truncate">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                          {getTimeAgo(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>

                    {/* Individual Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 transition-all absolute top-2 right-2"
                    >
                      <X size={14} />
                    </button>

                    {!notif.isRead && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-50 text-center bg-slate-50/50">
              <button
                className="text-[11px] font-bold text-slate-400 hover:text-green-600 transition-colors tracking-wide uppercase"
                onClick={onClose}
              >
                Close Panel
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDropdown;
