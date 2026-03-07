import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import CartItem from "../components/checkout/CartItem";
import SlotPicker from "../components/checkout/SlotPicker";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethods from "../components/checkout/PaymentMethods";

import useCartStore from "../store/useCartStore";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    updateQuantity: updateGlobalQuantity,
    getCartDetails,
    getCartTotal
  } = useCartStore();

  const cartItems = getCartDetails().map(item => ({
    id: `cart-item-${item.id}`,
    quantity: item.quantity,
    dish: item
  }));

  const [selectedSlot, setSelectedSlot] = useState(null);

  const subtotal = getCartTotal();

  const updateQuantity = (dishId, delta) => {
    updateGlobalQuantity(dishId, delta);
  };

  const handleKhaltiPayment = () => {
    if (!selectedSlot) {
      toast.error("Please select a pickup slot first!");
      return;
    }

    // Simulate payment process
    const loadingToast = toast.loading("Connecting to Khalti...");

    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Payment Received!");
      navigate("/order-success", { state: { selectedSlot } });
    }, 1500);
  };

  const handleCashPayment = () => {
    if (!selectedSlot) {
      toast.error("Please select a pickup slot first!");
      return;
    }

    toast.success("Order confirmed!");
    navigate("/order-success", { state: { selectedSlot } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-green-100">
      <Navbar />

      <main className="flex-1 pt-26 pb-20 px-4 relative">
        <div className="max-w-6xl mx-auto">

          {/* Compact Hero Section */}
          <div className="mb-8">
            <Link to="/menu" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-green-600 font-bold text-[11px] transition-colors mb-3 group uppercase tracking-widest">
              <ArrowLeft size={11} />
              Back to Menu
            </Link>
            <motion.h1
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight"
            >
              Review Your <span className="text-green-600">Selection.</span>
            </motion.h1>
            <p className="text-slate-500 text-sm mt-1.5 max-w-md leading-relaxed">
              Review your handcrafted selection and pick a timeline for pickup.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-10">

              {/* Cart Section */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">01. Your Curation</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        updateQuantity={updateQuantity}
                      />
                    ))}
                    {cartItems.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-center flex flex-col items-center"
                      >
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Your curation is empty</p>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-full shadow-sm"
                          onClick={() => navigate("/menu")}
                        >
                          Discover Delicious Meals
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* Booking Section */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">02. Pickup Timeline</h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <SlotPicker
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              </section>
            </div>

            {/* Right Column Sidebar */}
            <div className="lg:col-span-4 sticky top-28 self-start flex flex-col gap-4">
              <OrderSummary subtotal={subtotal} selectedSlot={selectedSlot}>
                <PaymentMethods
                  onPayKhalti={handleKhaltiPayment}
                  onPayCash={handleCashPayment}
                />
              </OrderSummary>

              <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Safe & Secured Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
