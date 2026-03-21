import apiClient from "../apiClient";

const userService = {
  // Get all users
  getAllUsers: async () => {
    return apiClient.get("/users");
  },

  // Create user
  createUser: (data) => apiClient.post("/users", data),

  // Get admin user details for chat
  getAdminUser: async () => {
    return apiClient.get("/users/admin");
  },

  // Get user by ID
  getUserById: async (id) => {
    return apiClient.get(`/users/${id}`);
  },

  // Update user
  updateUser: async (id, data) => {
    return apiClient.put(`/users/${id}`, data);
  },

  // Delete user
  deleteUser: async (id) => {
    return apiClient.delete(`/users/${id}`);
  },

  // Get all roles
  getRoles: async () => {
    return apiClient.get("/users/roles");
  },
};

export default userService;
