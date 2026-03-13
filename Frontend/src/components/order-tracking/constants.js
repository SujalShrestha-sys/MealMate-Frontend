import { Package, Clock } from "lucide-react";

// Order Status Labels
export const STATUS_LABELS = {
  PENDING: "Processing",
  CONFIRMED: "Confirmed",
  PREPARING: "In Kitchen",
  READY_FOR_PICKUP: "Ready for Pickup",
  COMPLETED: "Completed",
};

// Tab Config
export const TABS = [
  {
    id: "active",
    label: "Active Orders",
    mobileLabel: "Active",
    icon: Package,
  },
  {
    id: "history",
    label: "Order History",
    mobileLabel: "History",
    icon: Clock,
  },
];

// Shared Animation Easing
export const EASE = [0.4, 0, 0.2, 1];

// Helpers
export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const getDisplayId = (order) => {
  const id = order._id || order.id || "";
  return id ? id.slice(-8).toUpperCase() : "N/A";
};
