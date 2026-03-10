import apiClient from '../apiClient';

/**
 * User Service
 * Manages user-specific data and profiles.
 */
const userService = {
    /**
     * Update User Profile
     * @param {Object} data 
     */
    updateProfile: async (data) => {
        return await apiClient.put('/user/profile', data);
    },

    /**
     * Fetch all users (example for admin)
     */
    getAllUsers: async () => {
        return await apiClient.get('/user/all');
    },

    /**
     * Get specific user by ID
     * @param {string} userId 
     */
    getUserById: async (userId) => {
        return await apiClient.get(`/user/${userId}`);
    }
};

export default userService;
