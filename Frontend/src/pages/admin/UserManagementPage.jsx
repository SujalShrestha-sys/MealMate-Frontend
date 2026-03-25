import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import AdminLayout from "../../components/admin/AdminLayout";
import UserTable from "../../components/admin/users/UserTable";
import {
  AddEditUserModal,
  DeleteUserModal,
} from "../../components/admin/users/UserModals";
import userService from "../../api/services/user.service";
import toast from "react-hot-toast";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [addEditOpen, setAddEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Could not load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await userService.getRoles();
      if (response.success) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddUser = () => {
    setSelectedUser(null);
    setAddEditOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setAddEditOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteOpen(true);
  };

  const handleCreateOrUpdate = async (data) => {
    const isEditing = !!selectedUser;

    const promise = isEditing
      ? userService.updateUser(selectedUser.id, data)
      : userService.createUser(data);

    toast.promise(promise, {
      loading: isEditing ? "Updating user..." : "Creating user...",
      success: isEditing
        ? "User updated successfully"
        : "User created successfully",
      error: (err) =>
        err.response?.data?.message ||
        (isEditing ? "Update failed" : "Creation failed"),
    });

    try {
      await promise;
      setAddEditOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    const promise = userService.deleteUser(userToDelete.id);

    toast.promise(promise, {
      loading: "Removing user...",
      success: "User removed",
      error: "Removal failed",
    });

    try {
      await promise;
      setDeleteOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <AdminLayout activePath="/admin/users">
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
              User Management
            </Typography>
            <Typography variant="body2" sx={{ color: "grey.500" }}>
              Manage access, roles, and status for all system accounts.
            </Typography>
          </Box>
        </Box>

        <UserTable
          users={filteredUsers}
          loading={loading}
          onSearchChange={handleSearchChange}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
          onAdd={handleAddUser}
        />

        <AddEditUserModal
          open={addEditOpen}
          onClose={() => setAddEditOpen(false)}
          onSave={handleCreateOrUpdate}
          user={selectedUser}
          roles={roles}
        />

        <DeleteUserModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
          userName={userToDelete?.name || ""}
        />
      </Box>
    </AdminLayout>
  );
};

export default UserManagementPage;
