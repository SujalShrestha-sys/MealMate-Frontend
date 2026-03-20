import React from "react";
import { Box, IconButton, Avatar, InputBase } from "@mui/material";
import { Search, Bell, Menu } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const AdminTopbar = ({ onMenuToggle }) => {
  const { user } = useAuthStore();

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <Box
      sx={{
        height: 72,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "grey.100",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, sm: 3, md: 4 },
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left: Hamburger (mobile) + Search */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {/* Hamburger — visible only on mobile/tablet */}
        <IconButton
          onClick={onMenuToggle}
          sx={{
            display: { xs: "flex", lg: "none" },
            color: "grey.600",
          }}
        >
          <Menu size={22} />
        </IconButton>

        {/* Search */}
        <Box
          sx={{
            position: "relative",
            flex: { xs: 1, sm: "initial" }, // Flexible on mobile, fixed on larger
            width: { sm: 280, md: 360 },
            display: "flex",
            alignItems: "center",
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 1,
            px: 1.5,
            transition: "all 0.2s ease",
            "&:focus-within": {
              borderColor: "primary.light",
              boxShadow: "0 0 0 3px rgba(249,115,22,0.1)",
            },
          }}
        >
          <Search size={18} style={{ color: "#94a3b8", flexShrink: 0 }} />
          <InputBase
            placeholder="Search orders..."
            sx={{
              ml: 1,
              flex: 1,
              fontSize: "0.875rem",
              "& .MuiInputBase-input::placeholder": { color: "grey.600" },
            }}
          />
        </Box>
      </Box>

      {/* Right Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          sx={{
            border: "1px solid",
            borderColor: "grey.200",
            borderRadius: 1.5,
            width: 40,
            height: 40,
            color: "grey.500",
            "&:hover": {
              borderColor: "primary.light",
              color: "primary.main",
              bgcolor: "#fff7ed",
            },
          }}
        >
          <Bell size={20} />
        </IconButton>

        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          {getInitials(user?.name)}
        </Avatar>
      </Box>
    </Box>
  );
};

export default AdminTopbar;
