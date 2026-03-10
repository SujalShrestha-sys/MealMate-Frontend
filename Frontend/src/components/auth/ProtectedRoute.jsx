import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

/**
 * ProtectedRoute
 * Wraps routes that require authentication.
 * Redirects to /login if the user is not authenticated.
 */
export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login, but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * PublicRoute
 * Wraps routes that should NOT be accessible when logged in (e.g., Login, SignUp).
 * Redirects to home if the user is already authenticated.
 */
export const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (isLoggedIn) {
    // Redirect to the page they were trying to access, or home
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};
