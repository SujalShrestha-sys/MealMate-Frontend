import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Skeleton } from "@mui/material";
import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import adminService from "../../api/services/admin.service";

const MotionPaper = motion.create(Paper);

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #f1f5f9",
  borderRadius: "12px",
  fontSize: "13px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const SalesTrendChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const response = await adminService.getSalesTrend();
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch sales trend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, []);

  if (loading) {
    return (
      <Skeleton variant="rectangular" height={315} sx={{ borderRadius: 1 }} />
    );
  }

  return (
    <MotionPaper
      elevation={0}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      sx={{
        p: { xs: 2.5, sm: 3 }, // Reduced padding on mobile
        borderRadius: 1,
        border: "1px solid",
        borderColor: "grey.100",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "grey.500",
            mb: 0.5,
          }}
        >
          Weekly Sales Trend
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
            Rs.{data?.totalWeekRevenue?.toLocaleString() || 0}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: data?.revenueChange >= 0 ? "success.main" : "error.main",
            }}
          >
            {data?.revenueChange >= 0 ? "+" : ""}{data?.revenueChange}% this week
          </Typography>
        </Box>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data?.revenueByDay || []}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(val) => [`Rs.${val.toLocaleString()}`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#f97316"
            strokeWidth={2.5}
            fill="url(#salesGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </MotionPaper>
  );
};

export default SalesTrendChart;
