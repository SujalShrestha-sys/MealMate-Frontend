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
  Avatar,
} from "@mui/material";
import { motion } from "motion/react";
import { Search, Plus, Edit2, Trash2, Mail, Shield } from "lucide-react";

const MotionPaper = motion.create(Paper);

const UserTable = ({ users, onSearchChange, onEdit, onDelete, onAdd }) => {
  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return { color: "#7c3aed", bg: "#f5f3ff" };
      case "TEACHER":
        return { color: "#2563eb", bg: "#eff6ff" };
      case "STUDENT":
        return { color: "#059669", bg: "#ecfdf5" };
      default:
        return { color: "grey.500", bg: "grey.50" };
    }
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
        borderRadius: 1, // 16px
        border: "1px solid",
        borderColor: "grey.100",
        bgcolor: "#fff",
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
          User Accounts
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
            placeholder="Search users..."
            size="small"
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flex: { xs: 1, sm: "none" },
              minWidth: { xs: "100%", sm: 240 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontSize: "0.875rem",
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: "grey.100" },
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
              bgcolor: "#10b981",
              color: "#fff",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#059669", boxShadow: "none" },
            }}
          >
            Add New User
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["User", "User ID", "Email", "Role", "Actions"].map((header) => (
                <TableCell key={header} sx={headerStyle}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="grey.500">
                    No users found matching your search.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const roleStyle = getRoleColor(user.role?.name);

                return (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:hover": { bgcolor: "#f8fafc" },
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={user.avatar} // Support avatar if present
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            bgcolor: roleStyle.bg,
                            color: roleStyle.color,
                            fontSize: "0.875rem",
                            fontWeight: 700,
                          }}
                        >
                          {user.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, color: "grey.800" }}
                        >
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "grey.500",
                        fontSize: "0.8125rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {user.id.substring(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Mail size={14} color="#94a3b8" />
                        <Typography variant="body2" sx={{ color: "grey.600" }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={user.role?.name || "STUDENT"}
                        sx={{
                          bgcolor: roleStyle.bg,
                          color: roleStyle.color,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Button
                          size="small"
                          onClick={() => onEdit(user)}
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
                          onClick={() => onDelete(user)}
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
    </MotionPaper>
  );
};

export default UserTable;
