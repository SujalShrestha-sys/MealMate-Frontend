import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { AlertTriangle } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import InventoryStats from "../../components/admin/inventory/InventoryStats";
import InventoryTable from "../../components/admin/inventory/InventoryTable";
import {
  AddEditModal,
  DeleteConfirmModal,
} from "../../components/admin/inventory/InventoryModals";
import inventoryService from "../../api/services/inventory.service";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });

  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inventoryService.getInventoryItems(
        pagination.page,
        pagination.limit,
        search,
      );
      setItems(response.data);
      setPagination((prev) => ({ ...prev, total: response.pagination.total }));

      const lowStockRes = await inventoryService.getLowStockItems();
      setStats({
        total: response.pagination.total,
        lowStock: lowStockRes.data.length,
        outOfStock: response.data.filter((item) => item.quantity <= 0).length,
      });
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast.error("Could not load inventory stats");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchInventory(), 300);
    return () => clearTimeout(timer);
  }, [fetchInventory]);

  const handleCreateOrUpdate = async (data) => {
    const operation = selectedItem
      ? inventoryService.updateInventoryItem(selectedItem.id, data)
      : inventoryService.createInventoryItem(data);

    toast.promise(operation, {
      loading: selectedItem
        ? "Updating ingredient..."
        : "Creating new ingredient...",
      success: selectedItem
        ? "Changes saved successfully"
        : "Ingredient added to inventory",
      error: (err) => err.message || "Something went wrong",
    });

    try {
      await operation;
      setAddEditOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const operation = inventoryService.deleteInventoryItem(itemToDelete.id);

    toast.promise(operation, {
      loading: "Removing from inventory...",
      success: "Item deleted successfully",
      error: "Failed to delete item",
    });

    try {
      await operation;
      setDeleteOpen(false);
      fetchInventory();
    } catch (error) {
      toast.error(error.message || "Failed to delete item");
    }
  };

  return (
    <AdminLayout activePath="/admin/inventory">
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
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Inventory Overview
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.500" }}>
              Monitor and manage your restaurant's stock levels effortlessly.
            </Typography>
          </Box>
        </Box>

        <InventoryStats stats={stats} />

        <AnimatePresence>
          {stats.lowStock > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  mb: 4,
                  p: 2.5,
                  bgcolor: "#fffbeb",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "#fde68a",
                  display: "flex",
                  alignItems: "center",
                  gap: 2.5,
                }}
              >
                <AlertTriangle size={20} color="#d97706" />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "#92400e" }}
                >
                  Warning: {stats.lowStock} items are running low on stock.
                  Restock soon.
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        <InventoryTable
          items={items}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          onSearchChange={setSearch}
          onAdd={() => {
            setSelectedItem(null);
            setAddEditOpen(true);
          }}
          onEdit={(item) => {
            setSelectedItem(item);
            setAddEditOpen(true);
          }}
          onDelete={handleDelete}
        />
      </Box>

      <AddEditModal
        open={addEditOpen}
        onClose={() => setAddEditOpen(false)}
        onSave={handleCreateOrUpdate}
        item={selectedItem}
      />

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || ""}
      />
    </AdminLayout>
  );
};

export default InventoryPage;
