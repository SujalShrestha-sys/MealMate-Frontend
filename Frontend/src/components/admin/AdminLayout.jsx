import React, { useState } from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "../../styles/admin.css";

const SIDEBAR_WIDTH = 250;

const AdminLayout = ({ children, activePath }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Desktop: permanent sidebar */}
      {isDesktop && (
        <Box
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <Box
            sx={{ position: "fixed", width: SIDEBAR_WIDTH, top: 0, bottom: 0 }}
          >
            <AdminSidebar activePath={activePath} />
          </Box>
        </Box>
      )}

      {/* Mobile / Tablet: drawer overlay */}
      {!isDesktop && (
        <Drawer
          open={mobileOpen}
          onClose={handleMenuToggle}
          PaperProps={{
            sx: {
              width: SIDEBAR_WIDTH,
              borderRight: "none",
            },
          }}
          ModalProps={{ keepMounted: true }}
        >
          <AdminSidebar activePath={activePath} />
        </Drawer>
      )}

      {/* Content */}
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}
      >
        <AdminTopbar onMenuToggle={handleMenuToggle} />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 3, sm: 3, md: 4 },
            overflowY: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
