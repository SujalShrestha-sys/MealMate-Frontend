import apiClient from "../apiClient";

const orderService = {
  // Create a new order (also creates payment)
  createOrder: (data) => {
    return apiClient.post("/admin/orders/create", data);
  },

  // Get orders for a specific user
  getOrdersByUser: (userId) => {
    return apiClient.get(`/admin/orders/user/${userId}`);
  },

  // Get all orders (Admin)
  getAllOrders: (config = {}) => {
    return apiClient.get("/admin/orders", config);
  },

  // Update order status (Admin)
  updateOrderStatus: (id, status) => {
    return apiClient.put(`/admin/orders/${id}/status`, { status });
  },

  // Cancel an order (Admin/User)
  cancelOrder: (orderId) => {
    return apiClient.delete(`/admin/orders/${orderId}/cancel`);
  },
};

export default orderService;
