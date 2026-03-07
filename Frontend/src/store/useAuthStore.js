import { create } from 'zustand';

/**
 * useAuthStore
 * This is a global state store using Zustand.
 * It manages the authentication status of the user across the entire application.
 */
const useAuthStore = create((set) => ({
  // The initial state: user is not logged in by default
  isLoggedIn: true,
  user: null,

  /**
   * login: Updates the state to signify the user is logged in.
   * @param {Object} userData - Information about the logged-in user.
   */
  login: (userData) => set({
    isLoggedIn: true,
    user: userData
  }),

  /**
   * logout: Reverts the state to the initial logged-out status.
   */
  logout: () => set({
    isLoggedIn: false,
    user: null
  }),

  /**
   * toggleLogin: A simple helper to flip the login status (useful for testing).
   */
  toggleLogin: () => set((state) => ({
    isLoggedIn: !state.isLoggedIn
  })),
}));

export default useAuthStore;
