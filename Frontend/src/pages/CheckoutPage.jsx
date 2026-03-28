import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Button from "../components/common/Button";
import CartItem from "../components/checkout/CartItem";
import SlotPicker from "../components/checkout/SlotPicker";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethods from "../components/checkout/PaymentMethods";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import orderService from "../api/services/order.service";
import paymentService from "../api/services/payment.service";
import subscriptionService from "../api/services/subscription.service";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    items,
    updateQuantity: updateGlobalQuantity,
    getCartTotal,
    fetchCart,
    clearCart,
  } = useCartStore();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("KHALTI");

  React.useEffect(() => {
    fetchCart();

    const fetchSubscription = async () => {
      try {
        const response = await subscriptionService.getMySubscription();
        if (response.success) {
          const subData = response.data;

          if (subData) {
            setSubscription(subData);

            // Auto-select subscription if valid
            if (subData.status === "ACTIVE" && subData.remainingMeals > 0) {
              setSelectedMethod("SUBSCRIPTION");
            }
          } else {
            setSubscription(null);
          }
        }
      } catch (error) {
        console.log(
          "No active subscription or failed to fetch:",
          error.message,
        );
        setSubscription(null);
      }
    };
    fetchSubscription();
  }, [fetchCart]);

  const cartItems = items;
  const subtotal = getCartTotal();

  const updateQuantity = (dishId, delta) => {
    updateGlobalQuantity(dishId, delta);
  };
  const handlePayment = async (method) => {
    if (isProcessing) return;

    if (!selectedSlot) {
      toast.error("Please select a pickup slot first!");
      return;
    }
    if (!user) {
      toast.error("Please login to place an order.");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading(
      method === "KHALTI" ? "Connecting to Khalti..." : "Placing order...",
    );

    try {
      const orderResponse = await orderService.createOrder({
        userId: user?.id,
        pickupSlotId: selectedSlot?.id,
        method,
        items: items.map((item) => ({
          dishId: item.dishId,
          quantity: item.quantity,
        })),
      });

      if (!orderResponse.success) {
        toast.dismiss(loadingToast);
        toast.error(orderResponse.message || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      const orderId = orderResponse.data.order.id;

      if (method === "KHALTI") {
        const returnUrl = `${window.location.origin}/payment/verify`;
        const paymentResponse = await paymentService.initiatePayment({
          orderId,
          method: "KHALTI",
          return_url: returnUrl,
        });

        toast.dismiss(loadingToast);

        if (paymentResponse.success && paymentResponse.data?.payment_url) {
          toast.success("Redirecting to Khalti...");
          localStorage.setItem("pending_order_id", orderId);
          localStorage.setItem("pending_slot", JSON.stringify(selectedSlot));

          window.location.href = paymentResponse.data.payment_url;
        } else {
          toast.error("Could not connect to Khalti. Try again.");
        }
      } else if (method === "SUBSCRIPTION") {
        toast.dismiss(loadingToast);
        await clearCart();
        toast.success("Order confirmed using subscription!");

        navigate("/order-success", {
          state: {
            orderId,
            selectedSlot,
            paymentMethod: "SUBSCRIPTION",
            totalAmount: 0,
          },
        });
      } else {
        // CASH: Order is already placed with COMPLETED payment
        toast.dismiss(loadingToast);

        await clearCart();
        toast.success("Order confirmed! Pay at pickup.");

        navigate("/order-success", {
          state: {
            orderId,
            selectedSlot,
            paymentMethod: "CASH",
            totalAmount: orderResponse.data.order.totalAmount,
          },
        });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Order error:", error.message);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-green-100">
      <Navbar />

      <main className="flex-1 pt-26 pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="mb-8">
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-green-600 font-bold text-[11px] transition-colors mb-3 group uppercase tracking-widest"
            >
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
              {/* Cart Items */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    01. Your Curation
                  </h2>
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
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                          Your curation is empty
                        </p>
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

              {/* Pickup Slots */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    02. Pickup Timeline
                  </h2>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
                <SlotPicker
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 sticky top-28 self-start flex flex-col gap-4">
              <OrderSummary subtotal={subtotal} selectedSlot={selectedSlot}>
                <PaymentMethods
                  selectedMethod={selectedMethod.toLowerCase()}
                  onMethodChange={(m) => setSelectedMethod(m.toUpperCase())}
                  onPayKhalti={() => handlePayment("KHALTI")}
                  onPayCash={() => handlePayment("CASH")}
                  onPaySubscription={() => handlePayment("SUBSCRIPTION")}
                  subscription={subscription}
                  disabled={isProcessing}
                />
              </OrderSummary>

              <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Safe & Secured Checkout
                </span>
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
