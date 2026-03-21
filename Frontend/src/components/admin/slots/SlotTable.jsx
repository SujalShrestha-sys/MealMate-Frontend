import React from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { Plus, Clock, Users, Edit2, Trash2, AlertCircle } from "lucide-react";

const SlotTable = ({
  loading,
  selectedDate,
  selectedDateSlots,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (current, max) => {
    const ratio = current / max;
    if (ratio >= 1) return "#ef4444"; // Full
    if (ratio >= 0.8) return "#f59e0b"; // Warning
    return "#f97316"; // Normal (Theme Orange)
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "grey.900",
              fontSize: { xs: "1rem", sm: "1.2rem" },
              lineHeight: 1.2,
            }}
          >
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "grey.400",
              fontWeight: 500,
              mt: 0.8,
              fontSize: "0.78rem",
            }}
          >
            {selectedDateSlots.length} Time Slots Scheduled
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<Plus size={18} />}
          onClick={onCreate}
          sx={{
            background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
            borderRadius: "12px",
            px: { xs: 1.5, sm: 2.5 },
            py: 1,
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(249, 115, 22, 0.1)",
          }}
        >
          {selectedDateSlots.length === 0 ? "Add First" : "Create Slots"}
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress size={32} sx={{ color: "primary.main" }} />
          </Box>
        ) : selectedDateSlots.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12, px: 3 }}>
            <Box
              sx={{
                bgcolor: "#f8fafc",
                width: 64,
                height: 64,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
              }}
            >
              <AlertCircle size={28} color="#e75a34ef" />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "grey.900", mb: 1 }}
            >
              No Pickup Slots Found
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "grey.500", maxWidth: 280, mx: "auto", mb: 2.5 }}
            >
              There are no pickup slots scheduled for this date yet.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={onCreate}
              sx={{
                borderRadius: "12px",
                borderColor: "grey.200",
                color: "grey.700",
                fontWeight: 700,
              }}
            >
              Add First Slot
            </Button>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      bgcolor: "#f8fafc",
                      color: "grey.500",
                      borderBottom: "1px solid #f1f5f9",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      py: 1.2,
                    }}
                  >
                    Window Time
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "#f8fafc",
                      color: "grey.500",
                      borderBottom: "1px solid #f1f5f9",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      py: 1.2,
                    }}
                  >
                    Booked
                  </TableCell>

                  <TableCell
                    sx={{
                      bgcolor: "#f8fafc",
                      color: "grey.500",
                      borderBottom: "1px solid #f1f5f9",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      py: 1.2,
                      textAlign: "right",
                      pr: 3,
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDateSlots.map((slot) => {
                  const current = slot._count?.bookings || 0;
                  const max = slot.maxOrders;
                  const percent = Math.min((current / max) * 100, 100);
                  const color = getStatusColor(current, max);

                  return (
                    <TableRow
                      key={slot.id}
                      sx={{
                        "& td": { py: 1.5, borderBottom: "1px solid #f1f5f9" },
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": { bgcolor: "#fcfcfd" },
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <Box
                            sx={{
                              p: 0.8,
                              borderRadius: 1.2,
                              bgcolor: `${color}10`,
                              color: color,
                            }}
                          >
                            <Clock size={14} />
                          </Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.875rem",
                              color: "grey.800",
                            }}
                          >
                            {formatTime(slot.startTime)} —{" "}
                            {formatTime(slot.endTime)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                          }}
                        >
                          <Users size={12} color="#94a3b8" />
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              color: "grey.700",
                            }}
                          >
                            {current}
                            <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                              /{max}
                            </span>
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 1, px: 0.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={percent}
                            sx={{
                              height: 3,
                              borderRadius: 1.5,
                              bgcolor: "#f1f5f9",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 1.5,
                                background:
                                  color === "#ef4444"
                                    ? "#ef4444"
                                    : `linear-gradient(90deg, #f97316, #fb923c)`,
                              },
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, textAlign: "right", pr: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0.2,
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => onEdit(slot)}
                            sx={{
                              color: "grey.400",
                              p: 0.5,
                              "&:hover": {
                                color: "primary.main",
                                bgcolor: "primary.50",
                              },
                            }}
                          >
                            <Edit2 size={14} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => onDelete(slot)}
                            sx={{
                              color: "grey.400",
                              p: 0.5,
                              "&:hover": {
                                color: "#ef4444",
                                bgcolor: "#fef2f2",
                              },
                            }}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default SlotTable;
