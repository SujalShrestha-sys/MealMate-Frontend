import React from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
  Chip,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  X,
  Mail,
  CreditCard,
  Clock,
  Hash,
  ShoppingBag,
  Calendar,
  Package,
} from "lucide-react";

const statusConfig = {
  PENDING: { color: "#ea580c", bg: "#fff7ed", label: "Pending" },
  CONFIRMED: { color: "#2563eb", bg: "#eff6ff", label: "Confirmed" },
  PREPARING: { color: "#d97706", bg: "#fffbeb", label: "Preparing" },
  READY_FOR_PICKUP: { color: "#16a34a", bg: "#f0fdf4", label: "Ready" },
  COMPLETED: { color: "#64748b", bg: "#f8fafc", label: "Completed" },
  CANCELLED: { color: "#ef4444", bg: "#fef2f2", label: "Cancelled" },
};

const OrderDetailsModal = ({ open, onClose, order }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!order) return null;

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const orderId = (order.id || order._id || "").slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt);

  // Handle different user data shapes from the API
  const userName = order.user?.name || order.user?.fullName || "Customer";
  const userEmail = order.user?.email || "—";
  const userInitial = userName[0]?.toUpperCase() || "C";

  // Format pickup slot time range
  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return null;
    const format = (iso) =>
      new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    return `${format(startTime)} – ${format(endTime)}`;
  };

  const pickupTime =
    formatTimeRange(order.pickupSlot?.startTime, order.pickupSlot?.endTime) ||
    order.pickupSlot?.timeRange ||
    (order.pickupTime
      ? new Date(order.pickupTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Not specified");

  // Handle payment info
  const paymentMethod = order.payment?.method || order.paymentMethod || "CASH";
  const paymentStatus =
    order.payment?.status || order.paymentStatus || "PENDING";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : "14px",
          overflow: "hidden",
          boxShadow: isMobile ? "none" : "0 25px 60px -12px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #fff7ed 0%, #fff 100%)",
          px: 3,
          pt: 3,
          pb: 2.5,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            right: 14,
            top: 14,
            color: "grey.400",
            bgcolor: "#fff",
            border: "1px solid",
            borderColor: "grey.100",
            "&:hover": { color: "grey.700" },
          }}
        >
          <X size={18} />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 16px -4px rgba(249,115,22,0.35)",
            }}
          >
            <ShoppingBag size={22} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, fontSize: "1.15rem" }}
              >
                Order Details
              </Typography>
              <Chip
                label={status.label}
                size="small"
                sx={{
                  bgcolor: status.bg,
                  color: status.color,
                  fontWeight: 800,
                  height: 24,
                  fontSize: "0.7rem",
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "grey.500",
                fontWeight: 600,
                fontSize: "0.78rem",
                mt: 0.25,
              }}
            >
              #{orderId} ·{" "}
              {orderDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Body */}
      <DialogContent sx={{ p: 3 }}>
        {/* Customer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            mb: 2.5,
            bgcolor: "#fafafa",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#fff7ed",
              color: "#f97316",
              fontWeight: 800,
              fontSize: "1.1rem",
              border: "2px solid #ffedd5",
            }}
          >
            {userInitial}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1rem" }}>
              {userName}
            </Typography>
            <Typography
              sx={{
                color: "grey.500",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Mail size={13} /> {userEmail}
            </Typography>
          </Box>
        </Box>

        {/* Info Cards */}
        <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
          {[
            { icon: Clock, label: "Pickup Slot", value: pickupTime },
            {
              icon: CreditCard,
              label: "Payment",
              value: `${paymentMethod} · ${paymentStatus}`,
            },
            {
              icon: Calendar,
              label: "Ordered",
              value: orderDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            {
              icon: Package,
              label: "Items",
              value: `${order.items?.length || 0} item(s)`,
            },
          ].map(({ icon: Icon, label, value }) => (
            <Grid size={{ xs: 6 }} key={label}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#fafafa",
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: "grey.100",
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: "#fff7ed",
                    color: "#f97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      color: "grey.400",
                      fontWeight: 700,
                      fontSize: "0.6rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      color: "grey.800",
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 2.5, borderStyle: "dashed" }} />

        {/* Order Items */}
        <Typography
          sx={{
            color: "grey.400",
            fontWeight: 800,
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            mb: 1.5,
          }}
        >
          Order Items
        </Typography>

        <Box
          sx={{
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "grey.100",
            overflow: "hidden",
            mb: 2.5,
          }}
        >
          {order.items?.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1.5,
                bgcolor: i % 2 === 0 ? "#fff" : "#fafafa",
                borderBottom: i < order.items.length - 1 ? "1px solid" : "none",
                borderColor: "grey.50",
                "&:hover": { bgcolor: "#fff7ed" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "8px",
                    overflow: "hidden",
                    bgcolor: "grey.100",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={
                      item.dish?.imageUrl ||
                      "https://placehold.co/100x100?text=🍽"
                    }
                    alt={item.dish?.name || "Food"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.dish?.name || "Menu Item"}
                  </Typography>
                  <Typography
                    sx={{
                      color: "grey.500",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.quantity} × Rs.{" "}
                    {item.priceAtPurchase || item.price || 0}
                  </Typography>
                </Box>
              </Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  ml: 1,
                  flexShrink: 0,
                }}
              >
                Rs. {(item.priceAtPurchase || item.price || 0) * item.quantity}
              </Typography>
            </Box>
          ))}

          {(!order.items || order.items.length === 0) && (
            <Typography
              sx={{
                textAlign: "center",
                py: 4,
                color: "grey.400",
                fontWeight: 600,
              }}
            >
              No items found
            </Typography>
          )}
        </Box>

        {/* Total */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
            p: 2.5,
            borderRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid #fed7aa",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#c2410c",
                fontWeight: 700,
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Total Amount
            </Typography>
            <Typography
              sx={{ color: "grey.500", fontSize: "0.75rem", fontWeight: 600 }}
            >
              {order.items?.length || 0} items · {paymentMethod}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontWeight: 900,
              color: "#ea580c",
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Rs. {order.totalAmount}
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      {/* Footer */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "grey.500",
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            borderRadius: "10px",
            border: "1px solid",
            borderColor: "grey.200",
            "&:hover": { bgcolor: "grey.50" },
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          disableElevation
          sx={{
            px: 4,
            py: 1.1,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 6px 16px -4px rgba(249,115,22,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #ea580c, #c2410c)",
            },
          }}
        >
          Confirm & Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default OrderDetailsModal;
