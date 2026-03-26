import { create } from "zustand";

/**
 * useAuthStore
 * Manages authentication state across the application.
 * AccessToken is in localStorage, RefreshToken is in httpOnly cookie.
 */
const getInitialUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

const useAuthStore = create((set) => ({
  isLoggedIn: !!(
    (localStorage.getItem("accessToken") || localStorage.getItem("token")) &&
    localStorage.getItem("user")
  ),
  user: getInitialUser(),

  /**
   * login: Stores user data and marks as logged in.
   * Tokens are handled by authService.login().
   */
  login: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({
      isLoggedIn: true,
      user: userData,
    });
  },

  /**
   * logout: Clears all auth data.
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      isLoggedIn: false,
      user: null,
    });
  },
}));

export default useAuthStore;
