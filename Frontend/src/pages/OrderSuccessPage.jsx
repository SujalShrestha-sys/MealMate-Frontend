import React, { useEffect, useState } from "react";
import { Clock, Home, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import StatusList from "../components/order-success/StatusList";
import CurationDetails from "../components/order-success/CurationDetails";
import useCartStore from "../store/useCartStore";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { width, height } = useWindowSize();
  const { clearCart } = useCartStore();

  const [orderId] = useState(() => {
    return (
      location.state?.orderId ||
      `MM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    );
  });
  const selectedSlot = location.state?.selectedSlot;

  useEffect(() => {
    clearCart();
    window.scrollTo(0, 0);
  }, [clearCart]);

  const formatTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "ASAP";

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-slate-100 overflow-x-hidden">
      <Navbar />

      {/* Subtle Confetti - Very light pieces for a touch of class */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={40}
        recycle={false}
        gravity={0.08}
        colors={["#10b981", "#cbd5e1"]}
        opacity={0.6}
      />

      <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Message & Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Confirmed & Processing
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                We're preparing your{" "}
                <span className="text-emerald-500">curation.</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                Thank you for your order. Your selection is being handcrafted
                with the finest ingredients and care.
              </p>
            </div>

            {/* Professional Status List */}
            <StatusList />
          </motion.div>

          {/* Right: Order Summary Details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-4xl p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.08)] border border-slate-100 relative group"
          >
            <div className="absolute inset-x-0 -top-px h-1 bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" />

            <h2 className="text-xl font-bold text-slate-900 mb-8 tracking-tight">
              Curation Details
            </h2>

            <CurationDetails
              orderId={orderId}
              selectedSlot={selectedSlot}
              formatTime={formatTime}
            />

            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                className="w-full rounded-2xl py-4.5 font-bold tracking-tight shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all"
                onClick={() =>
                  navigate("/order-tracking", {
                    state: {
                      newOrder: {
                        id: orderId,
                        totalAmount: location.state?.totalAmount || 1850,
                        status: "PENDING",
                        createdAt: new Date().toISOString(),
                        items: location.state?.items || [
                          {
                            quantity: 1,
                            dish: {
                              name: "Premium Curation Box",
                              imageUrl:
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                            },
                          },
                        ],
                        payment: {
                          status: "PAID",
                          method: location.state?.paymentMethod || "ESEWA",
                        },
                      },
                    },
                  })
                }
                icon={<Clock size={18} />}
              >
                Track Order
              </Button>
              <Button
                variant="secondary"
                className="w-full rounded-2xl py-4 font-bold hover"
                onClick={() => navigate("/")}
                icon={<Home size={18} />}
              >
                Go Home
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
