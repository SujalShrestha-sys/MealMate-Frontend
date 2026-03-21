import React from "react";
import { Box, Typography } from "@mui/material";

const SlotHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        mb: 4,
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}>
          Slot Management
        </Typography>
        <Typography variant="body2" sx={{ color: "grey.500" }}>
          Comprehensive scheduling and capacity monitoring for pre-order pickups.
        </Typography>
      </Box>
    </Box>
  );
};

export default SlotHeader;
