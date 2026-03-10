import apiClient from '../apiClient';

/**
 * Service for handling category-related API calls.
 */
const categoryService = {
    /**
     * Get all categories
     */
    getAllCategories: async () => {
        return await apiClient.get('/dishes/categories');
    }
};

export default categoryService;
