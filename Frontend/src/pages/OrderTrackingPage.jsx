import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, History } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import OrderCard from "../components/order-tracking/OrderCard";

const OrderTrackingPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial static mock data
    const staticMockData = [
      {
        id: "2b5558c-d977-45ed-bb51-d9a657bed3b",
        totalAmount: 2500,
        status: "PREPARING",
        createdAt: "2026-03-09T07:15:22.865Z",
        items: [
          {
            quantity: 2,
            dish: {
              name: "Avocado Toast",
              imageUrl:
                "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
            },
          },
        ],
        payment: {
          status: "PAID",
          method: "ESEWA",
        },
      },
      {
        id: "3c7778c-d977-45ed-bb51-e9a657bed3c",
        totalAmount: 1500,
        status: "READY",
        createdAt: "2026-03-08T18:30:00.865Z",
        items: [
          {
            quantity: 1,
            dish: {
              name: "Quinoa Bowl",
              imageUrl:
                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
            },
          },
        ],
        payment: {
          status: "PAID",
          method: "CASH",
        },
      },
    ];

    // Combine static data with any newly passed order
    let finalData = [...staticMockData];
    if (location.state?.newOrder) {
      // Check if it's already in the list (simple dedupe)
      if (!finalData.find((o) => o.id === location.state.newOrder.id)) {
        finalData = [location.state.newOrder, ...finalData];
      }
    }

    setTimeout(() => {
      setOrders(finalData);
      setLoading(false);

      // Simulate a status update for the new order to make it feel alive
      if (location.state?.newOrder) {
        setTimeout(() => {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === location.state.newOrder.id
                ? { ...o, status: "PREPARING" }
                : o,
            ),
          );
        }, 5000); // After 5 seconds, move to Preparing
      }
    }, 600);
  }, [location.state]);

  const activeOrders = orders.filter((o) => o.status !== "COMPLETED");
  const pastOrders = orders.filter((o) => o.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-emerald-50">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header Section - Elegant & Minimalist */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-50 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <h1 className="text-3xl md:text-[34px] font-extrabold text-slate-800 tracking-tight">
                Order <span className="text-emerald-600/80">Tracking</span>
              </h1>
              <p className="text-slate-400 font-medium text-[13px]">
                Follow your curation's journey from kitchen to hand-off.
              </p>
            </motion.div>

            {/* Tab Switcher - Clean Segmented Control */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex p-1 bg-slate-50 rounded-[1.25rem] border border-slate-100/80 w-full md:w-auto"
            >
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                  activeTab === "active"
                    ? "bg-white text-emerald-600 shadow-sm border border-slate-200/40"
                    : "text-slate-400 hover:text-slate-500"
                }`}
              >
                <ShoppingBag size={14} />
                Active
                {activeOrders.length > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[9px] font-bold">
                    {activeOrders.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                  activeTab === "history"
                    ? "bg-white text-emerald-600 shadow-sm border border-slate-200/40"
                    : "text-slate-400 hover:text-slate-500"
                }`}
              >
                <History size={14} />
                History
              </button>
            </motion.div>
          </header>

          {/* Content Area */}
          {loading ? (
            <div className="space-y-6 max-w-5xl mx-auto">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"
                />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "active" ? (
                <motion.div
                  key="active-orders"
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                      staggerChildren: 0.1,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                    y: -10,
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className="space-y-6 max-w-5xl mx-auto"
                >
                  {activeOrders.length > 0 ? (
                    activeOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-24 flex flex-col items-center text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-200 border border-slate-100">
                        <ShoppingBag size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        No active orders
                      </h3>
                      <p className="text-slate-500 font-medium max-w-xs text-sm">
                        Your dining journey starts here. Place an order to
                        begin.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="order-history"
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                    y: -10,
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className="space-y-3 max-w-4xl mx-auto"
                >
                  {pastOrders.length > 0 ? (
                    pastOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-emerald-100/50 hover:bg-slate-50/50 transition-all duration-500"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm">
                            <img
                              src={order.items[0].dish.imageUrl}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              alt=""
                            />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-base tracking-tight">
                              {order.items[0].dish.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-slate-900 text-lg tracking-tight">
                            Rs. {order.totalAmount.toLocaleString()}
                          </p>
                          <span className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                            Archived
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-200 border border-slate-100">
                        <History size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Empty Archive
                      </h3>
                      <p className="text-slate-500 font-medium max-w-xs text-sm">
                        Your culinary history will be preserved here.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
