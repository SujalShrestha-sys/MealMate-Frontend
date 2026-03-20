import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from "@mui/material";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

// Sidebar navigation items
const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Orders", icon: ClipboardList, path: "/admin/orders" },
  { label: "Menu", icon: UtensilsCrossed, path: "/admin/menu" },
  { label: "Reports", icon: BarChart3, path: "/admin/reports" },
];

const AdminSidebar = ({ activePath = "/admin/dashboard" }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: 250,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        p: 2,
      }}
    >
      {/* Brand Header */}
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            borderRadius: 0.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(249,115,22,0.15)",
          }}
        >
          <Sparkles size={18} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.15rem", color: "grey.900" }}>
          MealMate
        </Typography>
      </Box>

      <Divider sx={{ mb: 1, mx: 1 }} />

      {/* Main Navigation links */}
      <List sx={{ flex: 1, p: 0, mt: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;

          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                px: 2,
                py: 1, // Compact vertical spacing
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "#fff7ed",
                  color: "primary.main",
                  "&:hover": { bgcolor: "#fff7ed" },
                },
                "&:hover": {
                  bgcolor: "#fff7ed",
                  color: "primary.main",
                },
                color: "grey.600",
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                <Icon size={18} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Footer Area: User Profile & Logout */}
      <Box sx={{ mt: "auto", pt: 1 }}>
        <Divider sx={{ mb: 2, mx: 1, opacity: 0.5 }} />
        
        {/* User Card */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            p: 1.5,
            mb: 1,
            borderRadius: 1,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: "primary.light", 
              color: "primary.main",
              fontSize: "0.8rem",
              fontWeight: 700,
              border: "1px solid",
              borderColor: "primary.light"
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "A"}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "0.8125rem",
                color: "grey.900",
                lineHeight: 1.2,
                mb: 0.1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name || "Admin User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "grey.500",
                fontSize: "0.7rem",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || "admin@mealmate.com"}
            </Typography>
          </Box>
        </Box>

        {/* Logout Navigation */}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            px: 2,
            py: 1,
            color: "grey.600",
            "&:hover": { 
              bgcolor: "#fff7ed", 
              color: "primary.main",
              "& .MuiListItemIcon-root": { color: "primary.main" }
            },
            transition: "all 0.2s ease",
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
            <LogOut size={18} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default AdminSidebar;
