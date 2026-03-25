import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Skeleton,
} from "@mui/material";
import { Edit2, Trash2, Search, Plus, Image as ImageIcon } from "lucide-react";
import MenuItem from "@mui/material/MenuItem";
import { motion } from "motion/react";

const MotionPaper = motion.create(Paper);

const categoryColors = {
  "Main Course": { bg: "#eef2ff", color: "#4338ca", border: "#e0e7ff" },
  "Fast Food": { bg: "#fff7ed", color: "#c2410c", border: "#ffedd5" },
  Drinks: { bg: "#ecfeff", color: "#0891b2", border: "#cffafe" },
  Desserts: { bg: "#fdf2f8", color: "#be185d", border: "#fce7f3" },
  Snacks: { bg: "#f0fdf4", color: "#15803d", border: "#dcfce7" },
  Salads: { bg: "#f7fee7", color: "#4d7c0f", border: "#ecfccb" },
  Breakfast: { bg: "#fffbeb", color: "#b45309", border: "#fef3c7" },
};

const getCategoryStyle = (name) => {
  return (
    categoryColors[name] || {
      bg: "#f8fafc",
      color: "#64748b",
      border: "#f1f5f9",
    }
  );
};

const MenuTable = ({
  dishes,
  loading,
  pagination,
  categories,
  selectedCategory,
  onPageChange,
  onSearchChange,
  onCategoryChange,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <MotionPaper
      elevation={0}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 1,
        border: "1px solid",
        borderColor: "grey.100",
      }}
    >
      {/* Header & Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
          Menu Items
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: { xs: "100%", sm: "auto" },
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Quick Search..."
            size="small"
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 220 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "grey.50",
                "& fieldset": { borderColor: "grey.200" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            size="small"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            sx={{
              minWidth: 160,
              width: { xs: "100%", sm: "auto" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "grey.50",
                "& fieldset": { borderColor: "grey.200" },
              },
            }}
          >
            <MenuItem value="All">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={onAdd}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "0 4px 12px rgba(249,115,22,0.2)",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Add Dish
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "grey.600",
                }}
              >
                Dish
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "grey.600",
                }}
              >
                Category
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "grey.600",
                }}
              >
                Price
              </TableCell>
              <TableCell
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "grey.600",
                }}
              >
                Badge
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "grey.600",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton variant="text" height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : dishes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" color="grey.400">
                    No dishes found in the menu.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              dishes.map((dish) => (
                <TableRow
                  key={dish.id}
                  sx={{
                    "&:hover": { bgcolor: "#fef1e6e5" },
                    "&:last-child td": { borderBottom: 0 },
                    transition: "background 0.2s",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: "grey.100",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {dish.imageUrl ? (
                          <img
                            src={dish.imageUrl}
                            alt={dish.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <ImageIcon size={20} color="#94a3b8" />
                        )}
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700, color: "grey.900" }}
                        >
                          {dish.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="grey.500"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {dish.description || "No description provided."}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const style = getCategoryStyle(dish.category?.name);
                      return (
                        <Chip
                          label={dish.category?.name || "Uncategorized"}
                          size="small"
                          sx={{
                            bgcolor: style.bg,
                            color: style.color,
                            border: `1px solid ${style.border}`,
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            borderRadius: "6px",
                            textTransform: "uppercase",
                            letterSpacing: "0.02em",
                          }}
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "grey.800" }}>
                    Rs. {dish.price}
                  </TableCell>
                  <TableCell>
                    {dish.badge ? (
                      <Chip
                        label={dish.badge}
                        size="small"
                        sx={{
                          bgcolor: "#fff7ed",
                          color: "#ea580c",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          border: "1px solid #ffedd5",
                          borderRadius: 1,
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => onEdit(dish)}
                        startIcon={<Edit2 size={14} />}
                        sx={{
                          color: "primary.main",
                          bgcolor: "#fff7ed",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1.5,
                          textTransform: "none",
                          "&:hover": { bgcolor: "#ffedd5" },
                        }}
                      >
                        Edit
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(dish)}
                        sx={{
                          color: "#ef4444",
                          bgcolor: "#fef2f2",
                          borderRadius: 1.5,
                          p: 0.75,
                          "&:hover": { bgcolor: "#fee2e2", color: "#dc2626" },
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(e, page) => onPageChange(page)}
            color="primary"
            size="medium"
            sx={{ "& .MuiPaginationItem-root": { fontWeight: 700 } }}
          />
        </Box>
      )}
    </MotionPaper>
  );
};

export default MenuTable;
