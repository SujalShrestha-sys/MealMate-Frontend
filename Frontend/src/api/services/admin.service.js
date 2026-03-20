import apiClient from "../apiClient";

const adminService = {
  // All-time overview stats
  getStats: () => {
    return apiClient.get("/admin/stats");
  },

  // Today's dashboard stat cards
  getDashboardStats: () => {
    return apiClient.get("/admin/dashboard-stats");
  },

  // Sales trend data (revenue by day)
  getSalesTrend: () => {
    return apiClient.get("/admin/sales-trend");
  },

  // Busiest pickup hours data
  getBusiestHours: () => {
    return apiClient.get("/admin/busiest-hours");
  },

  // Live / Recent orders table
  getRecentOrders: () => {
    return apiClient.get("/admin/recent-orders");
  },
};

export default adminService;
