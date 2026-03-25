import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  X,
  Edit2,
  Plus,
  Image as ImageIcon,
  DollarSign,
  Award,
  FileText,
  Link as LinkIcon,
  Layers,
} from "lucide-react";

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontWeight: 500,
    bgcolor: "#fafafa",
    transition: "all 0.2s ease",
    "&:hover": { bgcolor: "#f5f5f5" },
    "&.Mui-focused": { bgcolor: "#fff" },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    fontSize: "0.9rem",
  },
};

export const AddEditDishModal = ({
  open,
  onClose,
  onSave,
  dish,
  categories,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryName: "",
    badge: "",
  });

  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (dish) {
      setFormData({
        name: dish.name || "",
        description: dish.description || "",
        price: dish.price || "",
        imageUrl: dish.imageUrl || "",
        categoryName: dish.category?.name || "",
        badge: dish.badge || "",
      });
      setShowNewCategory(false);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        categoryName: "",
        badge: "",
      });
      setShowNewCategory(false);
    }
  }, [dish, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryName" && value === "NEW_CATEGORY") {
      setShowNewCategory(true);
      setFormData((prev) => ({ ...prev, categoryName: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "14px",
          boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #fff7ed 0%, #fff 100%)",
          px: { xs: 2.5, sm: 3.5 },
          pt: 3,
          pb: 2.5,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "grey.400",
            bgcolor: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            "&:hover": { bgcolor: "#fff", color: "grey.700" },
          }}
        >
          <X size={18} />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px -4px rgba(249,115,22,0.35)",
              flexShrink: 0,
            }}
          >
            {dish ? <Edit2 size={22} /> : <Plus size={22} />}
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "grey.900",
                letterSpacing: "-0.02em",
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              {dish ? "Edit Dish Details" : "Add New Dish"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "grey.500", mt: 0.25, fontSize: "0.85rem" }}
            >
              {dish
                ? "Update the information for this dish"
                : "Fill in the details to add to your menu"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Content */}
      <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Dish Name — full width, prominent */}
          <TextField
            label="Dish Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Classic Burger"
            variant="outlined"
            sx={fieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FileText size={18} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
          />

          {/* Price + Category — two columns */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price (Rs.)"
                name="price"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                sx={fieldStyle}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarSign size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {!showNewCategory ? (
                <TextField
                  label="Category"
                  name="categoryName"
                  select
                  fullWidth
                  value={formData.categoryName}
                  onChange={handleChange}
                  sx={fieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Layers size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem
                      key={cat.id}
                      value={cat.name}
                      sx={{ fontWeight: 500 }}
                    >
                      {cat.name}
                    </MenuItem>
                  ))}
                  <MenuItem
                    value="NEW_CATEGORY"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    + Create New Category
                  </MenuItem>
                </TextField>
              ) : (
                <TextField
                  label="New Category"
                  name="categoryName"
                  fullWidth
                  value={formData.categoryName}
                  onChange={handleChange}
                  placeholder="e.g. Desserts"
                  sx={fieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Layers size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        size="small"
                        onClick={() => setShowNewCategory(false)}
                        sx={{ color: "grey.400" }}
                      >
                        <X size={16} />
                      </IconButton>
                    ),
                  }}
                />
              )}
            </Grid>
          </Grid>

          {/* Badge — full width */}
          <TextField
            label="Badge"
            name="badge"
            fullWidth
            value={formData.badge}
            onChange={handleChange}
            placeholder="e.g. Recommended, New, Best Seller"
            sx={fieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Award size={18} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
          />

          {/* Image URL + Preview */}
          <TextField
            label="Image URL"
            name="imageUrl"
            fullWidth
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            sx={fieldStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon size={18} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
          />

          {formData.imageUrl ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 180,
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "grey.100",
                bgcolor: "grey.50",
              }}
            >
              <img
                src={formData.imageUrl}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/600x400?text=Image+Not+Found";
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 120,
                borderRadius: "14px",
                border: "2px dashed",
                borderColor: "grey.200",
                bgcolor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <ImageIcon size={28} color="#cbd5e1" />
              <Typography
                variant="caption"
                sx={{ color: "grey.400", fontWeight: 600 }}
              >
                Paste an image URL above to preview
              </Typography>
            </Box>
          )}

          {/* Description */}
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly describe this dish — ingredients, flavors, etc."
            sx={fieldStyle}
          />
        </Box>
      </DialogContent>

      <Divider />

      {/* Actions */}
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          py: 2.5,
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "grey.500",
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            borderRadius: "10px",
            border: "1px solid",
            borderColor: "grey.200",
            "&:hover": { bgcolor: "grey.50", color: "grey.700" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disableElevation
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.95rem",
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
            boxShadow: "0 8px 20px -4px rgba(249,115,22,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
              boxShadow: "0 10px 24px -4px rgba(249,115,22,0.4)",
            },
          }}
        >
          {dish ? "Save Changes" : "Create Dish"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const DeleteConfirmModal = ({ open, onClose, onConfirm, dishName }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogContent sx={{ p: 4, textAlign: "center", position: "relative" }}>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", right: 12, top: 12, color: "grey.400" }}
        >
          <X size={24} />
        </IconButton>

        <Box
          sx={{
            color: "#e11d48",
            mb: 2,
            display: "flex",
            justifyContent: "center",
          }}
        ></Box>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Remove Dish?
        </Typography>
        <Typography variant="body2" color="grey.500" sx={{ mb: 3 }}>
          Are you sure you want to remove <strong>{dishName}</strong> from the
          menu? This action cannot be undone.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            onClick={onClose}
            sx={{
              color: "grey.500",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onConfirm}
            sx={{
              bgcolor: "#e11d48",
              "&:hover": { bgcolor: "#be123c" },
              fontWeight: 700,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Yes, Remove
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
