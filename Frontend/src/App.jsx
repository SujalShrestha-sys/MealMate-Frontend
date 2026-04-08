import { Routes, Route, useLocation } from "react-router-dom";
import ChatManagementPage from "./pages/admin/ChatManagementPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";
import FoodDetailsPage from "./pages/FoodDetailsPage.jsx";
import Login from "./components/auth/Login.jsx";
import SignUp from "./components/auth/SignUp.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import OrderTrackingPage from "./pages/OrderTrackingPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import PaymentVerifyPage from "./pages/PaymentVerifyPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import InventoryPage from "./pages/admin/InventoryPage.jsx";
import SlotManagementPage from "./pages/admin/SlotManagementPage.jsx";
import UserManagementPage from "./pages/admin/UserManagementPage.jsx";
import SubscriptionManagementPage from "./pages/admin/SubscriptionManagementPage.jsx";
import MenuManagementPage from "./pages/admin/MenuManagementPage.jsx";
import OrderManagementPage from "./pages/admin/OrderManagementPage.jsx";
import ChatWidget from "./components/chat/ChatWidget.jsx";
import { Toaster } from "react-hot-toast";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/auth/ProtectedRoute.jsx";
import "./App.css";

import useCartStore from "./store/useCartStore";
import useAuthStore from "./store/useAuthStore";
import { useEffect, useMemo } from "react";

function App() {
  const location = useLocation();
  const { fetchCart } = useCartStore();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const isAuthPage = useMemo(() => {
    const path = location.pathname.toLowerCase();
    return (
      ["/login", "/signup", "/forgot-password"].includes(path) ||
      path.startsWith("/reset-password")
    );
  }, [location.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            }
          />
          <Route path="/plans" element={<PlansPage />} />

          {/* Public only routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/SignUp"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-tracking"
            element={
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/verify"
            element={
              <ProtectedRoute>
                <PaymentVerifyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food/:id"
            element={
              <ProtectedRoute>
                <FoodDetailsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute adminOnly>
                <MenuManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute adminOnly>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute adminOnly>
                <SubscriptionManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/slots"
            element={
              <ProtectedRoute adminOnly>
                <SlotManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chat"
            element={
              <ProtectedRoute adminOnly>
                <ChatManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <OrderManagementPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: "16px",
              background: "#fff",
              color: "#0f172a",
              fontSize: "14px",
              fontWeight: "600",
              padding: "12px 24px",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
          }}
        />
        {/* Hide on auth pages, landing page, admin pages, and plans page (if logged out) */}
        {!isAuthPage &&
          location.pathname !== "/" &&
          !location.pathname.startsWith("/admin") &&
          !(location.pathname.startsWith("/plans") && !isLoggedIn) && (
            <ChatWidget />
          )}
      </div>
    </ThemeProvider>
  );
}

export default App;