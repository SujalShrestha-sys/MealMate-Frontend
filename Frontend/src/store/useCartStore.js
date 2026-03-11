import { create } from "zustand";
import cartService from "../api/services/cart.service";
import toast from "react-hot-toast";

/**
 * useCartStore
 * This manages the shopping cart state.
 * It syncs with the backend when the user is logged in.
 */
const useCartStore = create((set, get) => ({
  items: [], // [{ id, cartItemId, dish, quantity }]
  isLoading: false,

  /**
   * fetchCart: Syncs local state with backend
   */
  fetchCart: async () => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await cartService.getCart();
      if (response.success) {
        set({ items: response.data.items });
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * addItem: Adds a dish to the cart
   */
  addItem: async (dishId, quantity = 1) => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const response = await cartService.addToCart(dishId, quantity);
      if (response.success) {
        await get().fetchCart();
        toast.success("Item added to cart");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  },

  /**
   * updateQuantity: Updates quantity of a cart item
   */
  updateQuantity: async (dishId, delta) => {
    const { items } = get();
    const item = items.find((i) => i.dishId === dishId);

    if (!item) {
      if (delta > 0) return get().addItem(dishId, delta);
      return;
    }

    const newQty = item.quantity + delta;

    try {
      if (newQty <= 0) {
        const response = await cartService.removeCartItem(item.id);
        if (response.success) toast.success("Item removed");
      } else {
        await cartService.updateCartItem(item.id, newQty);
      }
      await get().fetchCart();
    } catch (error) {
      console.error("Update quantity failed:", error);
    }
  },

  /**
   * removeItem: Removes item by ID (cartItemId or dishId)
   */
  removeItem: async (cartItemId) => {
    try {
      const response = await cartService.removeCartItem(cartItemId);
      if (response.success) {
        await get().fetchCart();
        toast.success("Item removed");
      }
    } catch (error) {
      console.error("Remove item failed:", error);
    }
  },

  /**
   * clearCart: Empties the entire cart.
   */
  clearCart: async () => {
    if (get().items.length === 0) return;
    try {
      const response = await cartService.clearCart();
      if (response.success) {
        set({ items: [] });
      }
    } catch (error) {
      console.error("Clear cart failed:", error);
    }
  },

  /**
   * getCartTotal: Calculates total price.
   */
  getCartTotal: () => {
    return get().items.reduce(
      (acc, item) => acc + item.dish.price * item.quantity,
      0,
    );
  },

  /**
   * getCartCount: Returns total quantity.
   */
  getCartCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },

  /**
   * getQuantity: Returns quantity for a specific dishId
   */
  getQuantity: (dishId) => {
    const item = get().items.find((i) => i.dishId === dishId);
    return item ? item.quantity : 0;
  },
}));

export default useCartStore;
