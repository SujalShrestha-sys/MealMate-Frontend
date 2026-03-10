import apiClient from '../apiClient';


const authService = {
    /**
     * Login user
     * @param {Object} credentials - { email, password }
     */
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        // Backend returns: { tokens: { accessToken: "..." }, user: { ... } }
        if (response.tokens?.accessToken) {
            localStorage.setItem('token', response.tokens.accessToken);
        }
        return response;
    },

    /**
     * Register a new user
     * @param {Object} userData
     */
    register: async (userData) => {
        return await apiClient.post('/auth/register', userData);
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('token');
    },

    /**
     * Forget Password
     * @param {string} email 
     */
    forgetPassword: async (email) => {
        return await apiClient.post('/auth/forget-password', { email });
    },

    /**
     * Reset Password
     * @param {string} token 
     * @param {string} newPassword 
     */
    resetPassword: async (token, password, confirmPassword) => {
        return await apiClient.post(`/auth/reset-password/${token}`, { password, confirmPassword });
    }
};

export default authService;
