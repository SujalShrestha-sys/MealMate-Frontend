import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Skeleton,
} from "@mui/material";
import { motion } from "motion/react";
import adminService from "../../api/services/admin.service";

const MotionPaper = motion.create(Paper);

const tabs = ["All", "Pending", "Ready", "Collected"];

// Chip color map
const chipConfig = {
  ready: { color: "#16a34a", bg: "#f0fdf4" },
  pending: { color: "#ea580c", bg: "#fff7ed" },
  collected: { color: "#64748b", bg: "#f1f5f9" },
  confirmed: { color: "#2563eb", bg: "#eff6ff" },
  preparing: { color: "#d97706", bg: "#fffbeb" },
  ready_for_pickup: { color: "#16a34a", bg: "#f0fdf4" },
};

const LiveOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await adminService.getRecentOrders();
        if (response.success) {
          setOrders(response.data.recentOrders);
        }
      } catch (error) {
        console.error("Failed to fetch recent orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = (
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === activeTab.toLowerCase())
  ).slice(0, 6);

  if (loading) {
    return (
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
    );
  }

  const formatItems = (items) => {
    return items.map((i) => `${i.quantity}x ${i.dish.name}`).join(", ");
  };

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <MotionPaper
      elevation={0}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      sx={{
        p: { xs: 2, sm: 3 }, // Reduced padding on mobile
        borderRadius: 1,
        border: "1px solid",
        borderColor: "grey.100",
      }}
    >
      {/* Header with Tabs */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
          Live Orders
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {tabs.map((tab) => (
            <Button
              key={tab}
              size="small"
              variant={activeTab === tab ? "contained" : "text"}
              onClick={() => setActiveTab(tab)}
              sx={{
                borderRadius: "10px",
                fontSize: "0.8125rem",
                fontWeight: 500,
                px: 2,
                py: 0.75,
                minWidth: "auto",
                textTransform: "none",
                ...(activeTab === tab
                  ? {
                      bgcolor: "primary.main",
                      color: "#fff",
                      "&:hover": { bgcolor: "primary.dark" },
                    }
                  : {
                      color: "grey.500",
                      "&:hover": { bgcolor: "#fff7ed", color: "primary.main" },
                    }),
              }}
            >
              {tab}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Order ID",
                "Customer Name",
                "Items",
                "Pickup Time",
                "Status",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "grey.400",
                    whiteSpace: "nowrap",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="grey.500">
                    No orders found for this category.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const cfg = chipConfig[order.status] || {
                  color: "#64748b",
                  bg: "#f1f5f9",
                };
                return (
                  <TableRow
                    key={order._id}
                    sx={{
                      "&:hover": { bgcolor: "#fef1e6e5" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                      {order._id}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {order.user.name}
                    </TableCell>
                    <TableCell>{formatItems(order.items)}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatTime(order.pickupTime)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={order.status.replace(/_/g, " ")}
                        icon={
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: cfg.color,
                            }}
                          />
                        }
                        sx={{
                          bgcolor: cfg.bg,
                          color: cfg.color,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderRadius: "9999px",
                          textTransform: "capitalize",
                          "& .MuiChip-icon": { ml: 0.5 },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MotionPaper>
  );
};

export default LiveOrdersTable;
