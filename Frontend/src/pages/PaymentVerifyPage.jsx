import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import paymentService from "../api/services/payment.service";
import useCartStore from "../store/useCartStore";

const PaymentVerifyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const { clearCart } = useCartStore();
  const hasVerified = React.useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      // Khalti sends back pidx and other params in the URL
      const pidx = searchParams.get("pidx");
      const paymentStatus = searchParams.get("status");

      if (!pidx) {
        setStatus("failed");
        toast.error("Invalid payment callback.");
        return;
      }

      // If Khalti already says it was canceled/expired
      if (paymentStatus === "User canceled" || paymentStatus === "Expired") {
        setStatus("failed");
        toast.error(
          paymentStatus === "User canceled"
            ? "Payment was canceled."
            : "Payment link has expired.",
        );
        return;
      }

      try {
        // Verify with backend
        const response = await paymentService.verifyPayment(pidx);

        if (response.success) {
          const paymentData = response.data;

          if (paymentData.orderId) {
            await clearCart();
            toast.success("Order payment verified!");

            // Get and clean up saved order info from localStorage
            const pendingOrderId = localStorage.getItem("pending_order_id");
            let pendingSlot = null;
            try {
              pendingSlot = JSON.parse(localStorage.getItem("pending_slot"));
            } catch (error) {
              toast.error("Failed to parse pending slot info.");
              console.log("Failed to parse pending slot:", error);
            }

            localStorage.removeItem("pending_order_id");
            localStorage.removeItem("pending_slot");

            navigate("/order-success", {
              state: {
                orderId: pendingOrderId || paymentData.orderId,
                selectedSlot: pendingSlot,
                paymentMethod: "KHALTI",
              },
            });
          } else if (paymentData.subscriptionId) {
            toast.success("Subscription activated successfully!");
            // Redirect to plans page with success state
            navigate("/plans", {
              state: {
                paymentSuccess: true,
                subscriptionId: paymentData.subscriptionId,
              },
            });
          } else {
            toast.success("Payment verified!");
            navigate("/");
          }
        } else {
          setStatus("failed");
          toast.error(response.message || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        toast.error("Payment verification failed.");
      }
    };

    verifyPayment();
  }, [searchParams, navigate, clearCart]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          {/* Verifying */}
          {status === "verifying" && (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                <Loader2 size={36} className="text-green-600 animate-spin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Verifying Payment...
                </h1>
                <p className="text-slate-500">
                  Please wait while we confirm your payment with Khalti.
                </p>
              </div>
            </div>
          )}

          {/* Failed */}
          {status === "failed" && (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                <XCircle size={40} className="text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Payment <span className="text-red-500">Failed</span>
                </h1>
                <p className="text-slate-500">
                  Your payment could not be verified. Please try again or choose
                  a different method.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  className="rounded-2xl px-10 py-4 font-bold"
                  onClick={() => navigate("/checkout")}
                >
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-2xl px-10 py-3 font-bold"
                  onClick={() => navigate("/")}
                >
                  Go Home
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentVerifyPage;
