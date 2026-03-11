import apiClient from "../apiClient";

const notificationService = {
  // Get user notifications
  getUserNotifications: () => {
    return apiClient.get("/notifications");
  },

  // Get unread count
  getUnreadCount: () => {
    return apiClient.get("/notifications/unread/count");
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    return apiClient.put(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return apiClient.put("/notifications/read/all");
  },

  // Delete notification
  deleteNotification: (notificationId) => {
    return apiClient.delete(`/notifications/${notificationId}`);
  },

  // Delete all notifications
  deleteAllNotifications: () => {
    return apiClient.delete("/notifications/delete/all");
  },
};

export default notificationService;
