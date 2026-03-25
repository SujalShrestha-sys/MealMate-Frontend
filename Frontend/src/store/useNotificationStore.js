import { create } from "zustand";
import notificationService from "../api/services/notification.service";

/**
 * useNotificationStore
 * Manages live notifications synced with the backend.
 */
const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // Fetch all notifications from backend
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await notificationService.getUserNotifications();
      if (response.success) {
        set({
          notifications: response.data,
          unreadCount: response.unreadCount || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch only unread count
  fetchUnreadCount: async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        set({ unreadCount: response.unreadCount });
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  },

  // Add a new notification (real-time)
  addNotification: (notif) => {
    set((state) => {
      // Avoid duplicate notifications
      if (state.notifications.some((n) => n.id === notif.id)) {
        return state;
      }

      // Convert backend fields to store fields if necessary
      const newNotification = {
        id: notif.id,
        title: notif.title || notif.senderName || "New Alert",
        message: notif.message || notif.content,
        createdAt: notif.createdAt || new Date().toISOString(),
        isRead: notif.isRead || false,
      };

      return {
        notifications: [newNotification, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + (newNotification.isRead ? 0 : 1),
      };
    });
  },

  // Mark a single notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            isRead: true,
          })),
          unreadCount: 0,
        }));
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  },

  // Delete a single notification
  deleteNotification: async (notificationId) => {
    try {
      const response =
        await notificationService.deleteNotification(notificationId);
      if (response.success) {
        set((state) => {
          const notif = state.notifications.find(
            (n) => n.id === notificationId,
          );
          return {
            notifications: state.notifications.filter(
              (n) => n.id !== notificationId,
            ),
            unreadCount:
              notif && !notif.isRead
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
          };
        });
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  },

  // Delete all notifications
  deleteAllNotifications: async () => {
    try {
      const response = await notificationService.deleteAllNotifications();
      if (response.success) {
        set({ notifications: [], unreadCount: 0 });
      }
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    }
  },
}));

export default useNotificationStore;
