import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

/**
 * ProtectedRoute
 * Wraps routes that require authentication.
 * Redirects to /login if the user is not authenticated.
 */
export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, user } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toLowerCase();

  // 1. If route is admin-only, but user is NOT admin -> redirect to menu
  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/menu" replace />;
  }

  // 2. If route is for regular users (not adminOnly), but user IS admin -> redirect to admin dashboard
  if (!adminOnly && userRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

/**
 * PublicRoute
 * Wraps routes that should NOT be accessible when logged in (e.g., Login, SignUp).
 * Redirects to home if the user is already authenticated.
 */
export const PublicRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuthStore();
  const location = useLocation();

  if (isLoggedIn) {
    // If admin, redirect to admin dashboard instead of home/menu
    if (user?.role?.toLowerCase() === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // Redirect to the page they were trying to access, or the menu page
    const from = location.state?.from?.pathname || "/menu";
    return <Navigate to={from === "/" ? "/menu" : from} replace />;
  }

  return children;
};
