import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import AdminLayout from "../../components/admin/AdminLayout";
import MenuStats from "../../components/admin/menu/MenuStats";
import MenuTable from "../../components/admin/menu/MenuTable";
import {
  AddEditDishModal,
  DeleteConfirmModal,
} from "../../components/admin/menu/MenuModals";
import dishService from "../../api/services/dish.service";
import toast from "react-hot-toast";

const MenuManagementPage = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stats, setStats] = useState({
    totalDishes: 0,
    totalCategories: 0,
    availableItems: 0,
    topCategory: "",
  });

  // Modals state
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishToDelete, setDishToDelete] = useState(null);

  const fetchData = useCallback(
    async (page = 1, query = "") => {
      try {
        setLoading(true);
        let response;
        if (query) {
          response = await dishService.searchDishes(query, page);
        } else if (selectedCategory && selectedCategory !== "All") {
          response = await dishService.getByCategory(selectedCategory, page);
        } else {
          response = await dishService.getAllDishes(page);
        }

        if (response.success) {
          setDishes(response.data);
          setPagination(response.pagination);

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalDishes: response.pagination.totalDishes,
          }));
        }

        // Fetch categories for the dropdown and stats
        const catResponse = await dishService.getAllCategories();
        if (catResponse.success) {
          setCategories(catResponse.data);

          // Calculate additional stats
          const activeCategories = catResponse.data.length;
          const availableItems = catResponse.data.reduce(
            (acc, cat) => acc + cat.dishes.length,
            0,
          );
          const topCat =
            catResponse.data.sort(
              (a, b) => b.dishes.length - a.dishes.length,
            )[0]?.name || "N/A";

          setStats((prev) => ({
            ...prev,
            totalCategories: activeCategories,
            availableItems: availableItems,
            topCategory: topCat,
          }));
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setDishes([]);
          setPagination({ currentPage: 1, totalPages: 1 });
        } else {
          console.error("Failed to fetch menu data:", error);
          toast.error("Could not load menu items");
        }
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData, search, selectedCategory]);

  const handleSave = async (formData) => {
    try {
      let response;
      if (selectedDish) {
        response = await dishService.updateDish(selectedDish.id, formData);
      } else {
        response = await dishService.createDish(formData);
      }

      if (response.success) {
        toast.success(selectedDish ? "Dish updated!" : "Dish added to menu!");
        setAddEditOpen(false);
        fetchData(pagination.currentPage, search);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleConfirmDelete = async () => {
    if (!dishToDelete) return;

    try {
      const response = await dishService.deleteDish(dishToDelete.id);
      if (response.success) {
        toast.success("Dish removed from menu");
        setDeleteOpen(false);
        fetchData(pagination.currentPage, search);
      }
    } catch (error) {
      toast.error("Failed to delete dish");
      console.error("Delete error:", error);
    }
  };

  return (
    <AdminLayout activePath="/admin/menu">
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            mb: 4,
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Menu Management
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.500" }}>
              Create, update, and organize your dishes and categories.
            </Typography>
          </Box>
        </Box>

        <MenuStats stats={stats} loading={loading} />

        <Box sx={{ overflowX: "auto", width: "100%", mb: 2.5 }}>
          <MenuTable
            dishes={dishes}
            loading={loading}
            pagination={pagination}
            categories={categories}
            selectedCategory={selectedCategory}
            onPageChange={(page) => fetchData(page, search)}
            onSearchChange={setSearch}
            onCategoryChange={setSelectedCategory}
            onAdd={() => {
              setSelectedDish(null);
              setAddEditOpen(true);
            }}
            onEdit={(dish) => {
              setSelectedDish(dish);
              setAddEditOpen(true);
            }}
            onDelete={(dish) => {
              setDishToDelete(dish);
              setDeleteOpen(true);
            }}
          />
        </Box>

        <AddEditDishModal
          open={addEditOpen}
          onClose={() => setAddEditOpen(false)}
          onSave={handleSave}
          dish={selectedDish}
          categories={categories}
        />

        <DeleteConfirmModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          dishName={dishToDelete?.name || ""}
        />
      </Box>
    </AdminLayout>
  );
};

export default MenuManagementPage;
