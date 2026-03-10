import apiClient from '../apiClient';

/**
 * Service for handling dish-related API calls.
 */
const dishService = {
    /**
     * Get all dishes (paginated)
     * @param {number} page 
     * @param {number} limit 
     */
    getAllDishes: async (page = 1, limit = 10) => {
        return await apiClient.get('/dishes', {
            params: { page, limit }
        });
    },

    /**
     * Get a single dish by ID
     * @param {string} id 
     */
    getSingleDish: async (id) => {
        return await apiClient.get(`/dishes/${id}`);
    },

    /**
     * Search dishes by name or description
     * @param {string} searchTerm 
     * @param {number} page 
     * @param {number} limit 
     */
    searchDishes: async (searchTerm, page = 1, limit = 10) => {
        return await apiClient.get('/dishes/search', {
            params: { item: searchTerm, page, limit }
        });
    },

    /**
     * Get dishes by category name
     * @param {string} category 
     * @param {number} page 
     * @param {number} limit 
     */
    getByCategory: async (category, page = 1, limit = 10) => {
        // Backend: router.get("/category/:category", getByCategory);
        return await apiClient.get(`/dishes/category/${category}`, {
            params: { page, limit }
        });
    },

    /**
     * Create a new dish (Admin only)
     * @param {Object} dishData 
     */
    createDish: async (dishData) => {
        return await apiClient.post('/dishes/create', dishData);
    },

    /**
     * Update an existing dish (Admin only)
     * @param {string} id 
     * @param {Object} dishData 
     */
    updateDish: async (id, dishData) => {
        return await apiClient.put(`/dishes/${id}`, dishData);
    },

    /**
     * Delete a dish (Admin only)
     * @param {string} id 
     */
    deleteDish: async (id) => {
        return await apiClient.delete(`/dishes/${id}`);
    }
};

export default dishService;
