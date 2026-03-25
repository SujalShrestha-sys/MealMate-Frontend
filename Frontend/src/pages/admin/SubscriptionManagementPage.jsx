import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import {
  Search,
  XCircle,
  Calendar,
  User,
  Zap,
  Filter,
  Users,
  Clock,
  CreditCard,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/admin/StatCard";
import subscriptionService from "../../api/services/subscription.service";
import { Grid } from "@mui/material";
import toast from "react-hot-toast";

const SubscriptionManagementPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getAllSubscriptions();
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      toast.error("Could not load subscriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleCancelSubscription = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?"))
      return;

    try {
      const response = await subscriptionService.cancelSubscriptionAdmin(id);
      if (response.success) {
        toast.success("Subscription cancelled");
        fetchSubscriptions();
      }
    } catch (error) {
      toast.error("Failed to cancel subscription");
      console.error("Cancellation error:", error.message);
    }
  };

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.user.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(search.toLowerCase()) ||
      sub.plan.name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === "ACTIVE").length,
    pending: subscriptions.filter((s) => s.status === "PENDING_PAYMENT").length,
    revenue: subscriptions.reduce(
      (acc, s) => acc + (s.status === "ACTIVE" ? s.plan.price || 0 : 0),
      0,
    ),
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Chip
            label="Active"
            size="small"
            sx={{
              bgcolor: "#ecfdf5",
              color: "#059669",
              fontWeight: 700,
              border: "1px solid",
              borderColor: "#10b98133",
              fontSize: "0.7rem",
              borderRadius: "6px",
            }}
          />
        );
      case "PENDING_PAYMENT":
        return (
          <Chip
            label="Pending"
            size="small"
            sx={{
              bgcolor: "#fff7ed",
              color: "#d97706",
              fontWeight: 700,
              border: "1px solid",
              borderColor: "#f59e0b33",
              fontSize: "0.7rem",
              borderRadius: "6px",
            }}
          />
        );
      case "CANCELLED":
        return (
          <Chip
            label="Cancelled"
            size="small"
            sx={{
              bgcolor: "#f3f4f6",
              color: "#4b5563",
              fontWeight: 700,
              fontSize: "0.7rem",
              borderRadius: "6px",
            }}
          />
        );
      case "EXPIRED":
        return (
          <Chip
            label="Expired"
            size="small"
            sx={{ bgcolor: "red.50", color: "red.700", fontWeight: 700 }}
          />
        );
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <AdminLayout activePath="/admin/subscriptions">
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            mb: 4,
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Subscription Management
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.500" }}>
              Oversee all user plans, meal usage, and subscription statuses.
            </Typography>
          </Box>
        </Box>

        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Total Subscriptions"
              value={stats.total}
              trend="All time"
              icon={Users}
              delay={0.1}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Active Plans"
              value={stats.active}
              trend="Active Status"
              trendDirection="up"
              icon={Zap}
              delay={0.2}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Pending Payments"
              value={stats.pending}
              trend="Requires Action"
              trendDirection="neutral"
              icon={Clock}
              delay={0.3}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Active Revenue"
              value={`Rs.${stats.revenue.toLocaleString()}`}
              trend="Current Month"
              icon={CreditCard}
              delay={0.4}
            />
          </Grid>
        </Grid>

        <Card
          sx={{
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.100",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              borderBottom: "1px solid",
              borderColor: "grey.50",
              bgcolor: "grey.25",
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Search by user or plan..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: 300,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  borderRadius: 1.5,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} className="text-slate-400" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: "grey.50" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "grey.600",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      tracking: 1,
                    }}
                  >
                    User
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "grey.600",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      tracking: 1,
                    }}
                  >
                    Plan
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "grey.600",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      tracking: 1,
                    }}
                  >
                    Remaining Meals
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "grey.600",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      tracking: 1,
                    }}
                  >
                    Expiry Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "grey.600",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      tracking: 1,
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: "grey.600",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      tracking: 1,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell
                        colSpan={6}
                        sx={{ py: 3, textAlign: "center", color: "grey.400" }}
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 10, textAlign: "center" }}>
                      <Box sx={{ opacity: 0.5 }}>
                        <Zap
                          size={48}
                          className="mx-auto mb-2 text-slate-300"
                        />
                        <Typography variant="body2">
                          No subscriptions found
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((sub) => (
                      <TableRow
                        key={sub.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              itemsCenter: "center",
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                bgcolor: "primary.light",
                                color: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyCenter: "center",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                              }}
                            >
                              {sub.user.name[0]}
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 700, color: "grey.900" }}
                              >
                                {sub.user.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "grey.500" }}
                              >
                                {sub.user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {sub.plan.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "grey.500" }}
                          >
                            Rs.{sub.plan.price}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color:
                                  sub.remainingMeals < 3
                                    ? "red.600"
                                    : "inherit",
                              }}
                            >
                              {sub.remainingMeals}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "grey.400" }}
                            >
                              / {sub.plan.meals}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: "grey.600",
                            }}
                          >
                            <Calendar size={14} />
                            <Typography variant="body2">
                              {new Date(sub.endDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{getStatusChip(sub.status)}</TableCell>
                        <TableCell align="right">
                          {sub.status === "ACTIVE" && (
                            <Tooltip title="Cancel Subscription">
                              <IconButton
                                onClick={() => handleCancelSubscription(sub.id)}
                                sx={{
                                  color: "red.500",
                                  "&:hover": { bgcolor: "red.50" },
                                }}
                              >
                                <XCircle size={18} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredSubscriptions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Box>
    </AdminLayout>
  );
};

export default SubscriptionManagementPage;
