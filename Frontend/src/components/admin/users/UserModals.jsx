import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { X, AlertTriangle, User, Mail, Shield, Activity, Lock } from "lucide-react";

const modalPaperProps = {
  sx: {
    borderRadius: 1,
    p: 1,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
};

export const AddEditUserModal = ({
  open,
  onClose,
  onSave,
  user = null,
  roles = [],
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        roleId: user.roleId || "",
      });
    } else {
      setFormData({ name: "", email: "", password: "", roleId: "" });
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={modalPaperProps}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 4,
          px: 4,
          background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
          borderBottom: "1px solid",
          borderColor: "grey.50",
        }}
      >
        <Typography
          component="span"
          variant="h5"
          sx={{ fontWeight: 600, color: "#0f172a", letterSpacing: "0.02em" }}
        >
          {user ? "Edit User Account" : "Add New User"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "grey.400",
            bgcolor: "#fff",
            border: "1px solid",
            borderColor: "grey.100",
            "&:hover": { color: "#ef4444", borderColor: "#fecaca" },
          }}
        >
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 4, py: 4 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: "#fcfcfc",
                    "&:hover fieldset": { borderColor: "#e79110ff" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1.5, color: "#e79110ff", display: "flex" }}>
                      <User size={18} />
                    </Box>
                  ),
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: "#fcfcfc",
                    "&:hover fieldset": { borderColor: "#e79110ff" },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1.5, color: "#e79110ff", display: "flex" }}>
                      <Mail size={18} />
                    </Box>
                  ),
                }}
              />
            </Grid>
            {!user && (
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Account Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      bgcolor: "#fcfcfc",
                      "& fieldset": { borderColor: "grey.200" },
                      "&:hover fieldset": { borderColor: "#e79110ff" },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1.5, color: "#e79110ff", display: "flex" }}>
                        <Lock size={18} />
                      </Box>
                    ),
                  }}
                />
              </Grid>
            )}
            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Assign Role</InputLabel>
                <Select
                  name="roleId"
                  value={formData.roleId}
                  label="Assign Role"
                  onChange={handleChange}
                  sx={{
                    borderRadius: "14px",
                    bgcolor: "#fcfcfc",
                    "&:hover fieldset": { borderColor: "#e79110ff" },
                  }}
                  startAdornment={
                    <Box
                      sx={{
                        mr: 1.5,
                        color: "#e79110ff",
                        display: "flex",
                        ml: 1,
                      }}
                    >
                      <Shield size={18} />
                    </Box>
                  }
                >
                  {roles.map((r) => (
                    <MenuItem
                      key={r.id}
                      value={r.id}
                      sx={{
                        borderRadius: "8px",
                        mx: 1,
                        my: 0.5,
                        "&.Mui-selected": {
                          bgcolor: "rgba(16, 185, 129, 0.1)",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {r.name.toUpperCase()}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 4, pt: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: "#64748b",
              fontWeight: 700,
              textTransform: "none",
              mr: 2,
              borderRadius: "14px",
              px: 4,
              py: 1.5,
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            sx={{
              bgcolor: "#e79110ff",
              "&:hover": {
                bgcolor: "#e79110ff",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)",
              },
              transition: "all 0.3s",
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
              px: { xs: 4, sm: 6 },
              py: 1.5,
            }}
          >
            {user ? "Save Changes" : "Create Account"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const DeleteUserModal = ({ open, onClose, onConfirm, userName }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={modalPaperProps}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <Box sx={{ position: "absolute", right: 16, top: 16 }}>
        <IconButton onClick={onClose} size="small" sx={{ color: "grey.400" }}>
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ textAlign: "center", pb: 3, pt: 8 }}>
        <Box
          sx={{
            display: "inline-flex",
            p: 3,
            borderRadius: "50%",
            bgcolor: "rgba(239, 68, 68, 0.08)",
            color: "#ef4444",
            mb: 3,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50%",
              border: "2px solid #ef4444",
              opacity: 0.15,
            },
          }}
        >
          <AlertTriangle size={30} />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}
        >
          Remove Account
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#64748b", px: 2, mb: 1, lineHeight: 1.5 }}
        >
          Are you sure you want to revoke access for{" "}
          <Box component="span" sx={{ fontWeight: 600, color: "#1e293b" }}>
            {userName}
          </Box>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{ pb: 3.5, px: 4, justifyContent: "center", gap: 2.5 }}
      >
        <Button
          onClick={onClose}
          sx={{
            flex: 1,
            color: "#64748b",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "grey.200",
            py: 1.5,
            "&:hover": { bgcolor: "#f1f5f9", borderColor: "grey.300" },
          }}
        >
          Keep User
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            flex: 1,
            bgcolor: "#ef4444",
            "&:hover": {
              bgcolor: "#dc2626",
              transform: "translateY(-1px)",
              boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)",
            },
            transition: "all 0.2s",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.2)",
            py: 1.5,
          }}
          autoFocus
        >
          Yes, Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
};
