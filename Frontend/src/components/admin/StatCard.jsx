import React from "react";
import { Paper, Typography } from "@mui/material";
import { motion } from "motion/react";

const MotionPaper = motion.create(Paper);

const StatCard = ({
  label,
  value,
  trend,
  trendDirection = "up",
  delay = 0,
}) => {
  const trendColor = trendDirection === "up" ? "success.main" : "grey.400";

  return (
    <MotionPaper
      elevation={0}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      sx={{
        p: { xs: 2.5, sm: 3 }, // Reduced padding on mobile
        borderRadius: 1,
        border: "1px solid",
        borderColor: "grey.50",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 4px 16px rgba(249,115,22,0.06)",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "grey.500",
          fontWeight: 600,
          mb: 1,
          fontSize: "0.85rem",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, mb: 1, fontSize: "1.3rem" }}
      >
        {value}
      </Typography>
      {trend && (
        <Typography
          sx={{ color: trendColor, fontSize: "0.80rem", fontWeight: 600 }}
        >
          {trend}
        </Typography>
      )}
    </MotionPaper>
  );
};

export default StatCard;
