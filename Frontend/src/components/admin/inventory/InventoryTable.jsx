import React from "react";
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  TablePagination,
  Skeleton,
} from "@mui/material";
import { motion } from "motion/react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";

const MotionPaper = motion.create(Paper);

const InventoryTable = ({
  items,
  loading,
  pagination,
  onPageChange,
  onSearchChange,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const getStockStatus = (quantity, threshold) => {
    if (quantity <= 0)
      return { label: "Out of Stock", color: "#ef4444", bg: "#fef2f2" };
    if (quantity <= threshold)
      return { label: "Low Stock", color: "#ea580c", bg: "#fff7ed" };
    return { label: "In Stock", color: "#16a34a", bg: "#f0fdf4" };
  };

  const headerStyle = {
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "grey.400",
    py: 2,
    borderBottom: "1px solid #f1f5f9",
  };

  return (
    <MotionPaper
      elevation={0}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.100",
        transition: "all 0.3s ease-in-out",
        height: "100%",
        minWidth: { xs: "260px", sm: "auto" },
        bgcolor: "#ffffffff",
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "grey.800" }}>
          Inventory Stock
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            width: { xs: "100%", sm: "auto" },
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Search ingredients..."
            size="small"
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flex: { xs: 1, sm: "none" },
              minWidth: { xs: "100%", sm: 200 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "grey.200" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={onAdd}
            sx={{
              flex: { xs: 1, sm: "none" },
              borderRadius: "10px",
              fontSize: "0.875rem",
              fontWeight: 700,
              px: 3,
              py: 1,
              bgcolor: "#10b981", // Emerald Green for "Add"
              color: "#fff",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#059669", boxShadow: "none" },
            }}
          >
            Add Ingredient
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Ingredient",
                "Stock",
                "Unit",
                "Threshold",
                "Status",
                "Actions",
              ].map((header) => (
                <TableCell key={header} sx={headerStyle}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(pagination.limit || 5)).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton variant="text" width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={40} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={40} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={40} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="grey.500">
                    No items found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const status = getStockStatus(
                  item.quantity,
                  item.lowStockThreshold,
                );
                return (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:hover": { bgcolor: "#f8fafc" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700, color: "grey.800" }}>
                      {item.name}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {item.quantity}
                    </TableCell>
                    <TableCell sx={{ color: "grey.500" }}>
                      {item.unit}
                    </TableCell>
                    <TableCell sx={{ color: "grey.500" }}>
                      {item.lowStockThreshold}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={status.label}
                        sx={{
                          bgcolor: status.bg,
                          color: status.color,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Button
                          size="small"
                          onClick={() => onEdit(item)}
                          sx={{
                            minWidth: 0,
                            p: 1,
                            color: "grey.400",
                            "&:hover": {
                              color: "#10b981",
                              bgcolor: "rgba(16, 185, 129, 0.05)",
                            },
                          }}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size="small"
                          onClick={() => onDelete(item)}
                          sx={{
                            minWidth: 0,
                            p: 1,
                            color: "grey.400",
                            "&:hover": {
                              color: "#ef4444",
                              bgcolor: "rgba(239, 68, 68, 0.05)",
                            },
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ borderTop: "1px solid #f1f5f9", mt: 2 }}>
        <TablePagination
          component="div"
          count={pagination.total || 0}
          rowsPerPage={pagination.limit || 10}
          page={(pagination.page || 1) - 1}
          onPageChange={(e, p) => onPageChange(p + 1)}
          rowsPerPageOptions={[]}
          sx={{ borderTop: 0 }}
        />
      </Box>
    </MotionPaper>
  );
};

export default InventoryTable;
