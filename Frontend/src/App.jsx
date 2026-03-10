import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";
import FoodDetailsPage from "./pages/FoodDetailsPage.jsx";
import Login from "./components/auth/Login.jsx";
import SignUp from "./components/auth/SignUp.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import OrderTrackingPage from "./pages/OrderTrackingPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import ChatWidget from "./components/chat/ChatWidget.jsx";
import { Toaster } from "react-hot-toast";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/auth/ProtectedRoute.jsx";
import "./App.css";

import useCartStore from "./store/useCartStore";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const isAuthPage =
    ["/login", "/signup", "/forgot-password"].includes(
      location.pathname.toLowerCase(),
    ) || location.pathname.toLowerCase().startsWith("/reset-password");

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
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
        <Route path="/cart" element={<CartPage />} />
        <Route path="/food/:id" element={<FoodDetailsPage />} />
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
      {!isAuthPage && <ChatWidget />}
    </div>
  );
}

export default App;
