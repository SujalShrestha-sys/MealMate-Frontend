import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SlotCalendar = ({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  selectedDate,
  onDateSelect,
  months,
  slots,
}) => {
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: "#ffffff",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "grey.900",
            letterSpacing: "-0.01em",
          }}
        >
          {months[currentMonth]} {currentYear}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            onClick={onPrevMonth}
            size="small"
            sx={{
              color: "grey.400",
              p: 0.5,
              "&:hover": { color: "primary.main", bgcolor: "primary.50" },
            }}
          >
            <ChevronLeft size={18} />
          </IconButton>
          <IconButton
            onClick={onNextMonth}
            size="small"
            sx={{
              color: "grey.400",
              p: 0.5,
              "&:hover": { color: "primary.main", bgcolor: "primary.50" },
            }}
          >
            <ChevronRight size={18} />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          mb: 1,
          textAlign: "center",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
          <Typography
            key={i}
            sx={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "grey.300",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {d[0]}
          </Typography>
        ))}
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentMonth}-${currentYear}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
          }}
        >
          {blanks.map((b) => (
            <Box key={`blank-${b}`} />
          ))}
          {days.map((d) => {
            const dateObj = new Date(currentYear, currentMonth, d);
            const isSelected =
              dateObj.toDateString() === selectedDate.toDateString();
            const isToday =
              dateObj.toDateString() === new Date().toDateString();
            const hasSlots = slots.some(
              (s) =>
                new Date(s.startTime).toDateString() === dateObj.toDateString(),
            );

            return (
              <Box
                key={d}
                onClick={() => onDateSelect(dateObj)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  aspectRatio: "1",
                  borderRadius: "12px",
                  position: "relative",
                  bgcolor: isSelected ? "primary.main" : "transparent",
                  color: isSelected
                    ? "#fff"
                    : isToday
                      ? "primary.main"
                      : "grey.700",
                  fontWeight: isSelected || isToday ? 700 : 500,
                  transition: "all 0.2s ease",
                  fontSize: "0.875rem",
                  "&::after":
                    hasSlots && !isSelected
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 6,
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          opacity: 0.6,
                        }
                      : {},
                  "&:hover": {
                    bgcolor: isSelected ? "primary.dark" : "grey.50",
                    color: isSelected ? "#fff" : "grey.900",
                  },
                }}
              >
                {d}
              </Box>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #f8fafc" }}>
        <Typography
          sx={{
            color: "grey.900",
            fontWeight: 700,
            fontSize: "0.7rem",
            mb: 0.5,
          }}
        >
          Selected Date
        </Typography>
        <Typography
          sx={{ color: "grey.500", fontSize: "0.75rem", lineHeight: 1.4 }}
        >
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </Typography>
      </Box>
    </Box>
  );
};

export default SlotCalendar;
