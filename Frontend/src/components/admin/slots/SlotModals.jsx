import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  IconButton,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { X, Clock, AlertTriangle, Users } from "lucide-react";
import pickupSlotService from "../../../api/services/pickupSlot.service";
import toast from "react-hot-toast";

const modalPaperProps = {
  sx: {
    borderRadius: "12px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
  },
};

const SlotModals = ({ mode, open, onClose, slot, onSuccess, selectedDate }) => {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    maxOrders: "",
  });
  const [loading, setLoading] = useState(false);

  const getTimeString = (dateObj) => {
    if (!dateObj) return "";
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (open) {
      if (mode === "edit" && slot) {
        setFormData({
          startTime: getTimeString(new Date(slot.startTime)),
          endTime: getTimeString(new Date(slot.endTime)),
          maxOrders: slot.maxOrders || "",
        });
      } else {
        setFormData({ startTime: "", endTime: "", maxOrders: "" });
      }
    }
  }, [slot, open, mode]);

  const getStatusColor = (current, max) => {
    const percent = (current / max) * 100;
    if (percent === 0) return "#f97316";
    if (percent >= 100) return "#ef4444";
    if (percent > 80) return "#ea580c";
    return "#f97316";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const combineDateAndTime = (baseDate, timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const newDate = new Date(baseDate);
    newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return newDate;
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime || !formData.maxOrders) {
      toast.error("All fields are required");
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setLoading(true);
      const baseDate = slot
        ? new Date(slot.startTime)
        : selectedDate || new Date();
      const startDateTime = combineDateAndTime(baseDate, formData.startTime);
      const endDateTime = combineDateAndTime(baseDate, formData.endTime);

      const payload = {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        maxOrders: Number(formData.maxOrders),
      };

      const promise = slot
        ? pickupSlotService.updatePickupSlot(slot.id, payload)
        : pickupSlotService.createPickupSlot(payload);

      toast.promise(promise, {
        loading: slot ? "Updating schedule..." : "Creating schedule...",
        success: slot ? "Schedule optimized!" : "New slot added!",
        error: (err) => err.response?.data?.message || "Operation failed",
      });

      await promise;
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!slot) return;
    try {
      setLoading(true);
      const promise = pickupSlotService.deletePickupSlot(slot.id);

      toast.promise(promise, {
        loading: "Removing slot...",
        success: "Slot deleted successfully",
        error: "Failed to remove slot",
      });

      await promise;
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (mode === "delete") {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={modalPaperProps}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(3.5px)",
            backgroundColor: "rgba(15, 23, 42, 0.3)",
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", pb: 4, pt: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              p: 2.5,
              borderRadius: "50%",
              bgcolor: "rgba(239, 68, 68, 0.08)",
              color: "#ef4444",
              mb: 2,
            }}
          >
            <AlertTriangle size={30} strokeWidth={1.5} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: "1.35rem",
              mb: 1.5,
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            Remove Slot
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#64748b",
              px: 2,
              mb: 1.5,
              lineHeight: 1.5,
              fontSize: "0.95rem",
            }}
          >
            Are you sure you want to delete this pickup slot? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 0, justifyContent: "center", gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "#64748b",
              fontWeight: 600,
              border: "2px solid #f1f5f9",
              px: 3,
              borderRadius: "12px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #f43d3de6 0%, #dc2626 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.92rem",
              px: 3,
              py: 1.35,
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)",
              textTransform: "none",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #f15a5aff 0%, #b91c1c 100%)",
                transform: "translateY(-0.95px)",
              },
            }}
          >
            {loading ? "Deleting..." : "Delete Slot"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const displayedDate = slot
    ? new Date(slot.startTime)
    : selectedDate || new Date();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={modalPaperProps}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(15, 23, 42, 0.3)",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "grey.800", mb: 0.5 }}
          >
            {slot ? "Edit Slot" : "Create New Slot"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "grey.500", fontWeight: 500 }}
          >
            {slot
              ? "Update pickup window details"
              : "Schedule a new pickup window"}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "grey.400",
            "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" },
          }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleCreateOrUpdate}>
        <DialogContent sx={{ px: 4, py: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  mb: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "grey.400",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    mb: 1,
                  }}
                >
                  Target Date
                </Typography>
                <Typography
                  sx={{ fontSize: "1rem", fontWeight: 700, color: "grey.900" }}
                >
                  {displayedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "grey.700",
                  mb: 1.5,
                }}
              >
                Start Time
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <FormControl fullWidth>
                  <Select
                    name="startHour"
                    value={formData.startTime.split(":")[0] || "09"}
                    onChange={(e) => {
                      const mins = formData.startTime.split(":")[1] || "00";
                      setFormData((prev) => ({
                        ...prev,
                        startTime: `${e.target.value}:${mins}`,
                      }));
                    }}
                    sx={{ borderRadius: "12px", bgcolor: "#ffffff" }}
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <Select
                    name="startMin"
                    value={formData.startTime.split(":")[1] || "00"}
                    onChange={(e) => {
                      const hrs = formData.startTime.split(":")[0] || "09";
                      setFormData((prev) => ({
                        ...prev,
                        startTime: `${hrs}:${e.target.value}`,
                      }));
                    }}
                    sx={{ borderRadius: "12px", bgcolor: "#ffffff" }}
                  >
                    {["00", "15", "30", "45"].map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "grey.700",
                  mb: 1.5,
                }}
              >
                End Time
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <FormControl fullWidth>
                  <Select
                    name="endHour"
                    value={formData.endTime.split(":")[0] || "10"}
                    onChange={(e) => {
                      const mins = formData.endTime.split(":")[1] || "00";
                      setFormData((prev) => ({
                        ...prev,
                        endTime: `${e.target.value}:${mins}`,
                      }));
                    }}
                    sx={{ borderRadius: "12px", bgcolor: "#ffffff" }}
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <Select
                    name="endMin"
                    value={formData.endTime.split(":")[1] || "00"}
                    onChange={(e) => {
                      const hrs = formData.endTime.split(":")[0] || "10";
                      setFormData((prev) => ({
                        ...prev,
                        endTime: `${hrs}:${e.target.value}`,
                      }));
                    }}
                    sx={{ borderRadius: "12px", bgcolor: "#ffffff" }}
                  >
                    {["00", "15", "30", "45"].map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "grey.700",
                  mb: 1.5,
                }}
              >
                Maximum Orders
              </Typography>
              <TextField
                fullWidth
                name="maxOrders"
                type="number"
                value={formData.maxOrders}
                onChange={handleChange}
                placeholder="e.g. 50"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "#ffffff",
                    "& fieldset": { borderColor: "grey.200" },
                  },
                }}
                InputProps={{
                  inputProps: { min: 1 },
                  startAdornment: (
                    <Box sx={{ mr: 1, color: "primary.main", display: "flex" }}>
                      <Users size={18} />
                    </Box>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            borderTop: "1px solid #f1f5f9",
            bgcolor: "#f8fafc",
          }}
        >
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{ color: "grey.600", fontWeight: 700, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.875rem",
              px: 4,
              py: 1,
              borderRadius: "12px",
              boxShadow: "none",
              textTransform: "none",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(249, 115, 22, 0.2)",
              },
            }}
          >
            {loading ? "Saving..." : slot ? "Save Changes" : "Create Slot"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SlotModals;
