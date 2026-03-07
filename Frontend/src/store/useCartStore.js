import { create } from 'zustand';
import { products } from '../data/products';

/**
 * useCartStore
 * This manages the shopping cart state globally.
 * It stores items as an object for fast lookups and provides helper functions
 * to calculate totals and manage quantities.
 */
const useCartStore = create((set, get) => ({
  // items: { 1: 2, 5: 1 } where 1 and 5 are product IDs
  items: {},

  /**
   * addItem: Adds one to the quantity of a product.
   */
  addItem: (productId) => set((state) => ({
    items: {
      ...state.items,
      [productId]: (state.items[productId] || 0) + 1
    }
  })),

  /**
   * removeItem: Subtracts one from the quantity or removes it if it hits zero.
   */
  removeItem: (productId) => set((state) => {
    const newQty = (state.items[productId] || 0) - 1;
    const newItems = { ...state.items };
    
    if (newQty <= 0) {
      delete newItems[productId];
    } else {
      newItems[productId] = newQty;
    }
    
    return { items: newItems };
  }),

  /**
   * updateQuantity: Manually sets the quantity of an item.
   */
  updateQuantity: (productId, delta) => {
    if (delta > 0) get().addItem(productId);
    else get().removeItem(productId);
  },

  /**
   * clearCart: Empties the entire cart.
   */
  clearCart: () => set({ items: {} }),

  /**
   * getCartDetails: Returns a list of full product objects with their quantities.
   * Useful for displaying the items in the Navbar or Checkout.
   */
  getCartDetails: () => {
    const { items } = get();
    return Object.keys(items).map(id => {
      const product = products.find(p => p.id === parseInt(id));
      return {
        ...product,
        quantity: items[id]
      };
    }).filter(item => item !== undefined);
  },

  /**
   * getCartTotal: Calculates the total price of all items in the cart.
   */
  getCartTotal: () => {
    const details = get().getCartDetails();
    return details.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  },

  /**
   * getCartCount: Returns the total number of items in the cart.
   */
  getCartCount: () => {
    const { items } = get();
    return Object.values(items).reduce((acc, qty) => acc + qty, 0);
  }
}));

export default useCartStore;
