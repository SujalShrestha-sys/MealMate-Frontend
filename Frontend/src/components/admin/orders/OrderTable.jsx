import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
  Skeleton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Eye,
  MoreVertical,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

const MotionPaper = motion.create(Paper);
const MotionBox = motion.create(Box);

const statusConfig = {
  PENDING: { color: "#ea580c", bg: "#fff7ed", icon: Clock, label: "Pending" },
  CONFIRMED: {
    color: "#2563eb",
    bg: "#eff6ff",
    icon: CheckCircle2,
    label: "Confirmed",
  },
  PREPARING: {
    color: "#d97706",
    bg: "#fffbeb",
    icon: Clock,
    label: "Preparing",
  },
  READY_FOR_PICKUP: {
    color: "#16a34a",
    bg: "#f0fdf4",
    icon: Truck,
    label: "Ready",
  },
  COMPLETED: {
    color: "#64748b",
    bg: "#f8fafc",
    icon: CheckCircle2,
    label: "Completed",
  },
  CANCELLED: { color: "#ef4444", bg: "#fef2f2", icon: Ban, label: "Cancelled" },
};

const ROWS_PER_PAGE = 8;

const OrderTable = ({ orders, loading, onViewDetails, onStatusUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [page, setPage] = useState(0);

  const paginatedOrders = orders.slice(
    page * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE + ROWS_PER_PAGE,
  );

  useEffect(() => {
    setPage(0);
  }, [orders.length]);

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleStatusChange = (status) => {
    if (selectedOrder) {
      onStatusUpdate(selectedOrder.id, status);
    }
    handleMenuClose();
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%", p: 2 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={isMobile ? 120 : 60}
            sx={{ mb: 2, borderRadius: 2 }}
          />
        ))}
      </Box>
    );
  }

  // --- Mobile Card View ---
  if (isMobile) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        {paginatedOrders.map((order, idx) => {
          const status = statusConfig[order.status] || statusConfig.PENDING;
          return (
            <MotionBox
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onViewDetails(order)}
              sx={{
                bgcolor: "#fff",
                borderRadius: 3,
                p: 2,
                border: "1px solid",
                borderColor: "grey.100",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                "&:active": { bgcolor: "grey.50" },
              }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "grey.400" }}
                >
                  #{order.id.slice(-6).toUpperCase()}
                </Typography>
                <Chip
                  label={status.label}
                  size="small"
                  sx={{
                    bgcolor: status.bg,
                    color: status.color,
                    fontWeight: 800,
                    fontSize: "0.65rem",
                    height: 20,
                  }}
                />
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "primary.light",
                    color: "primary.main",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  {order.user?.name?.[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {order.user?.name}
                  </Typography>
                  <Typography variant="caption" color="grey.500">
                    {order.items?.length} items Rs. {order.totalAmount}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, order);
                  }}
                >
                  <MoreVertical size={18} color="#94a3b8" />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pt: 1.5,
                  borderTop: "1px solid",
                  borderColor: "grey.50",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "grey.500", fontWeight: 600 }}
                >
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "primary.main",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  View Details <ChevronRight size={14} />
                </Typography>
              </Box>
            </MotionBox>
          );
        })}
        {orders.length === 0 && (
          <Typography sx={{ textAlign: "center", py: 4, color: "grey.400" }}>
            No orders found
          </Typography>
        )}

        {orders.length > ROWS_PER_PAGE && (
          <TablePagination
            component="div"
            count={orders.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={ROWS_PER_PAGE}
            rowsPerPageOptions={[8]}
            sx={{
              borderTop: "1px solid",
              borderColor: "grey.100",
              ".MuiTablePagination-toolbar": { minHeight: 48 },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  fontSize: "0.8rem",
                  fontWeight: 600,
                },
            }}
          />
        )}

        {/* Reuse the Status Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}
        >
          {Object.entries(statusConfig).map(([key, config]) => (
            <MenuItem
              key={key}
              onClick={() => handleStatusChange(key)}
              sx={{ fontWeight: 600, fontSize: "0.875rem", gap: 1.5 }}
            >
              <config.icon size={16} color={config.color} />
              {config.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // --- Desktop Table View ---
  return (
    <TableContainer
      component={MotionPaper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      elevation={0}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.100",
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ bgcolor: "grey.50" }}>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "grey.600",
              }}
            >
              Order ID
            </TableCell>
            <TableCell
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "grey.600",
              }}
            >
              Customer
            </TableCell>
            <TableCell
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "grey.600",
              }}
            >
              Items
            </TableCell>
            <TableCell
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "grey.600",
              }}
            >
              Amount
            </TableCell>
            <TableCell
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "grey.600",
              }}
            >
              Status
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "grey.600",
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = status.icon;

            return (
              <TableRow
                key={order.id}
                sx={{
                  "&:hover": { bgcolor: "#fef1e6e5" },
                  transition: "background 0.2s",
                }}
              >
                <TableCell sx={{ fontWeight: 700, color: "grey.900" }}>
                  #{order.id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: "0.875rem",
                        bgcolor: "primary.light",
                        color: "primary.main",
                      }}
                    >
                      {order.user?.name?.[0] || "U"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {order.user?.name || "Unknown User"}
                      </Typography>
                      <Typography variant="caption" color="grey.500">
                        {order.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {order.items?.length || 0} Items
                  </Typography>
                  <Typography variant="caption" color="grey.500">
                    {order.items
                      ?.map((i) => i.dish?.name)
                      .join(", ")
                      .slice(0, 30)}
                    ...
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }}>
                  Rs. {order.totalAmount}
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<StatusIcon size={14} />}
                    label={status.label}
                    size="small"
                    sx={{
                      bgcolor: status.bg,
                      color: status.color,
                      fontWeight: 700,
                      borderRadius: 1.5,
                      "& .MuiChip-icon": { color: "inherit" },
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                  >
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onViewDetails(order)}
                        sx={{ color: "primary.main", bgcolor: "#fff7ed" }}
                      >
                        <Eye size={18} />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, order)}
                      sx={{ color: "grey.400" }}
                    >
                      <MoreVertical size={18} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {orders.length > ROWS_PER_PAGE && (
        <TablePagination
          component="div"
          count={orders.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={ROWS_PER_PAGE}
          rowsPerPageOptions={[8]}
          sx={{
            borderTop: "1px solid",
            borderColor: "grey.100",
            ".MuiTablePagination-toolbar": { minHeight: 52 },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                fontSize: "0.8rem",
                fontWeight: 600,
              },
          }}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}
      >
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: "block",
            color: "grey.400",
            fontWeight: 700,
          }}
        >
          UPDATE STATUS
        </Typography>
        {Object.entries(statusConfig).map(([key, config]) => (
          <MenuItem
            key={key}
            onClick={() => handleStatusChange(key)}
            sx={{ fontWeight: 600, fontSize: "0.875rem", gap: 1.5 }}
          >
            <config.icon size={16} color={config.color} />
            {config.label}
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  );
};

export default OrderTable;
