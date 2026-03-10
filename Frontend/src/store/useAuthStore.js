import { create } from 'zustand';

/**
 * useAuthStore
 * This is a global state store using Zustand.
 * It manages the authentication status of the user across the entire application.
 */
const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem('user');
    return null;
  }
};

const useAuthStore = create((set) => ({
  // The initial state: check if token exists in localStorage
  isLoggedIn: !!localStorage.getItem('token'),
  user: getInitialUser(),

  /**
   * login: Updates the state to signify the user is logged in.
   * @param {Object} userData - Information about the logged-in user.
   */
  login: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({
      isLoggedIn: true,
      user: userData
    });
  },

  /**
   * logout: Reverts the state to the initial logged-out status.
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      isLoggedIn: false,
      user: null
    });
  },

  /**
   * toggleLogin: A simple helper to flip the login status (useful for testing).
   */
  toggleLogin: () => set((state) => ({
    isLoggedIn: !state.isLoggedIn
  })),
}));

export default useAuthStore;
