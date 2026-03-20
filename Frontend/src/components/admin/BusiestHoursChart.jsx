import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Skeleton } from "@mui/material";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

const BusiestHoursChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const response = await adminService.getBusiestHours();
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch busiest hours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, []);

  if (loading) {
    return (
      <Skeleton variant="rectangular" height={315} sx={{ borderRadius: 1 }} />
    );
  }

  const formatHour = (hour) => {
    if (hour === 0) return "12am";
    if (hour === 12) return "12pm";
    return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  const peakHour = data?.peakHour || 0;

  return (
    <MotionPaper
      elevation={0}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
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
          Busiest Pickup Hours
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, fontSize: "1.75rem" }}>
          {formatHour(peakHour)} - {formatHour(peakHour + 1)}
        </Typography>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data?.busiestHours || []} barCategoryGap="25%">
          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(val) => formatHour(val)}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={tooltipStyle}
            labelFormatter={(val) => `Time: ${formatHour(val)}`}
            formatter={(val) => [`${val} orders`, "Pickups"]}
          />
          <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
            {(data?.busiestHours || []).map((entry, index) => (
              <Cell
                key={index}
                fill={entry.hour === peakHour ? "#f97316" : "#fed7aa"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </MotionPaper>
  );
};

export default BusiestHoursChart;
