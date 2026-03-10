import apiClient from '../apiClient';

/**
 * Service for handling persistent cart API calls.
 */
const cartService = {
    /**
     * Add an item to the user's persistent cart
     * @param {string} dishId 
     * @param {number} quantity 
     */
    addToCart: async (dishId, quantity = 1) => {
        return await apiClient.post('/cart', { dishId, quantity });
    },

    /**
     * Get the user's persistent cart contents
     */
    getCart: async () => {
        return await apiClient.get('/cart');
    },

    /**
     * Update quantity of a specific cart item
     * @param {string} cartItemId 
     * @param {number} quantity 
     */
    updateCartItem: async (cartItemId, quantity) => {
        return await apiClient.put(`/cart/${cartItemId}`, { quantity });
    },

    /**
     * Remove a specific item from the cart
     * @param {string} cartItemId 
     */
    removeCartItem: async (cartItemId) => {
        return await apiClient.delete(`/cart/${cartItemId}`);
    },

    /**
     * Clear the entire cart
     */
    clearCart: async () => {
        return await apiClient.delete('/cart/clear/all');
    }
};

export default cartService;
