import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle2,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import OrderTable from "../../components/admin/orders/OrderTable";
import OrderDetailsModal from "../../components/admin/orders/OrderDetailsModal";
import orderService from "../../api/services/order.service";
import toast from "react-hot-toast";

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await orderService.updateOrderStatus(id, status);
      if (response.success) {
        toast.success(`Order #${id.slice(-6).toUpperCase()} is now ${status}`);
        fetchOrders(); // Refresh list
      }
    } catch (error) {
      toast.error("Failed to update status", error.message);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusTab === "ALL" || order.status === statusTab;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout activePath="/admin/orders">
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "grey.900",
                  mb: 0.5,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                Order Management
              </Typography>
              <Typography variant="body2" color="grey.500">
                Track, fulfillment, and coordinate customer orders
              </Typography>
            </Box>
            <Button
              startIcon={<RefreshCw size={18} />}
              variant="outlined"
              onClick={fetchOrders}
              disabled={loading}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                width: { xs: "100%", sm: "auto" },
                height: "40px",
              }}
            >
              Refresh List
            </Button>
          </Box>

          {/* Stat Cards */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                label="Total Orders"
                value={orders.length}
                trend="Live Data"
                trendDirection="neutral"
                icon={ShoppingBag}
                delay={0.1}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                label="Pending"
                value={orders.filter((o) => o.status === "PENDING").length}
                trend="Needs Action"
                trendDirection="down"
                trendColor="#ea580c"
                icon={Clock}
                delay={0.2}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                label="Preparing"
                value={orders.filter((o) => o.status === "PREPARING").length}
                trend="In Kitchen"
                trendDirection="neutral"
                trendColor="#d97706"
                icon={RefreshCw}
                delay={0.3}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                label="Completed"
                value={orders.filter((o) => o.status === "COMPLETED").length}
                trend="Fulfilled"
                trendDirection="up"
                icon={CheckCircle2}
                delay={0.4}
              />
            </Grid>
          </Grid>

          {/* Filters & Table */}
          <Paper
            sx={{
              borderRadius: { xs: 0, sm: "12px" },
              p: 0,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "grey.100",
              mx: { xs: -2, sm: 0 },
            }}
            elevation={0}
          >
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 2,
                borderBottom: "1px solid",
                borderColor: "grey.100",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Tabs
                value={statusTab}
                onChange={(e, val) => setStatusTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 700,
                    minWidth: "auto",
                    px: 2,
                  },
                  "& .Mui-selected": { color: "primary.main" },
                }}
              >
                <Tab label="All" value="ALL" />
                <Tab label="Pending" value="PENDING" />
                <Tab label="Preparing" value="PREPARING" />
                <Tab label="Ready" value="READY_FOR_PICKUP" />
                <Tab label="Completed" value="COMPLETED" />
              </Tabs>

              <TextField
                size="small"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: { xs: "100%", sm: 240 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: "12px", bgcolor: "grey.50" },
                }}
              />
            </Box>

            <OrderTable
              orders={filteredOrders}
              loading={loading}
              onViewDetails={(order) => {
                setSelectedOrder(order);
                setDetailsOpen(true);
              }}
              onStatusUpdate={handleStatusUpdate}
            />
          </Paper>
        </Container>

        <OrderDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          order={selectedOrder}
        />
      </Box>
    </AdminLayout>
  );
};

export default OrderManagementPage;
