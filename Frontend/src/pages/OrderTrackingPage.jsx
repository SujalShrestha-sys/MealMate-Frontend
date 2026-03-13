import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package, Clock } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import OrderCard from "../components/order-tracking/OrderCard";
import TabSwitcher from "../components/order-tracking/TabSwitcher";
import HistoryRow from "../components/order-tracking/HistoryRow";
import EmptyState from "../components/order-tracking/EmptyState";
import { EASE } from "../components/order-tracking/constants";
import useAuthStore from "../store/useAuthStore";
import orderService from "../api/services/order.service";
import useChatStore from "../store/useChatStore";
import { LoadingSkeleton } from "../components/order-tracking/LoadingSkeleton";
import toast from "react-hot-toast";

//Main Page
const OrderTrackingPage = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthStore();
  const { socket } = useChatStore();

  useEffect(() => {
    if (!user?.id) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrdersByUser(user.id);
        if (response.success) setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.id]);

  useEffect(() => {
    if (!socket) return;
    const handleStatusUpdate = (data) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.orderId || o.id === data.orderId
            ? { ...o, status: data.status }
            : o,
        ),
      );
      if (data.status === "READY_FOR_PICKUP") {
        toast.success("Your order is ready for pickup!", {
          icon: "🍛",
          duration: 4000,
        });
      }
    };
    socket.on("order_status_updated", handleStatusUpdate);
    return () => socket.off("order_status_updated", handleStatusUpdate);
  }, [socket]);

  const activeOrders = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED",
  );
  const pastOrders = orders.filter(
    (o) => o.status === "COMPLETED" || o.status === "CANCELLED",
  );
  const counts = { active: activeOrders.length, history: pastOrders.length };

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                My <span className="text-green-600">Orders</span>
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Track your orders in real-time
              </p>
            </div>
            <TabSwitcher
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              counts={counts}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LoadingSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={activeTab === "active" ? "space-y-4" : "space-y-2"}
              >
                {activeTab === "active" ? (
                  activeOrders.length > 0 ? (
                    activeOrders.map((order, index) => (
                      <OrderCard
                        key={order._id || order.id}
                        order={order}
                        index={index}
                      />
                    ))
                  ) : (
                    <EmptyState
                      icon={Package}
                      title="No active orders"
                      description="Place an order from the menu to get started."
                    />
                  )
                ) : pastOrders.length > 0 ? (
                  pastOrders.map((order, i) => (
                    <HistoryRow
                      key={order._id || order.id}
                      order={order}
                      index={i}
                    />
                  ))
                ) : (
                  <EmptyState
                    icon={Clock}
                    title="No order history"
                    description="Completed orders will appear here."
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
