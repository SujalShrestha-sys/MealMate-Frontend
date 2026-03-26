import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  Avatar,
  Badge,
  List,
  ListItemButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Search, MessageSquare } from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";

/**
 * ChatList Component
 * Renders a searchable, filterable list of conversations for the admin.
 */
const ChatList = ({
  conversations = [],
  activeId,
  onSelect,
  activeTab,
  onTabChange,
}) => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();

  // Helper to resolve the chat partner from participants
  const getChatPartner = (conversation) => {
    if (!conversation || !conversation.participants || !user) return null;
    return conversation.participants.find((p) => p.id !== user.id);
  };

  // Helper to resolve user name robustly
  const getUserName = (partner) => {
    if (!partner) return "Customer";
    return partner.name || partner.fullName || partner.username || "Customer";
  };

  const filteredConversations = conversations.filter((c) => {
    const partner = getChatPartner(c);
    const name = getUserName(partner).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());

    if (activeTab === 0) return matchesSearch; // Active (all for now)
    if (activeTab === 1) return matchesSearch && !c.lastMessage; // New
    if (activeTab === 2) return matchesSearch && c.status === "CLOSED"; // Closed
    return matchesSearch;
  });

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = (now - date) / 1000 / 60; // diff in minutes

    if (diff < 1) return "Just now";
    if (diff < 60) return `${Math.floor(diff)} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 320, lg: 380 },
        height: "100%",
        display: { xs: activeId ? "none" : "flex", md: "flex" },
        flexDirection: "column",
        borderColor: "divider",
        bgcolor: "#fff",
      }}
    >
      {/* Search Bar */}
      <Box sx={{ p: 2, pb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color={theme.palette.text.secondary} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "14px",
              bgcolor: "#f8fafc",
              border: "1px solid",
              borderColor: "#e2e8f0",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover": { bgcolor: "#f1f5f9" },
              "&.Mui-focused": {
                bgcolor: "#fff",
                boxShadow: "0 4px 12px -2px rgba(0,0,0,0.05)",
                borderColor: "primary.light",
              },
              fontSize: "0.85rem",
              height: "40px",
              transition: "all 0.2s ease",
            },
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 2, mb: 0.5 }}>
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              fontSize: "0.75rem",
              fontWeight: 800,
              minHeight: 40,
              textTransform: "uppercase",
              color: "grey.500",
              letterSpacing: "0.05em",
              transition: "all 0.2s",
            },
            "& .Mui-selected": { color: "primary.main" },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: "2px",
              bgcolor: "primary.main",
            },
          }}
        >
          <Tab label="Active" />
          <Tab label="New" />
          <Tab label="Closed" />
        </Tabs>
      </Box>

      {/* Conversations List */}
      <List sx={{ flex: 1, overflowY: "auto", p: 1.5, pt: 0 }}>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((c) => {
            const partner = getChatPartner(c);
            const displayName = getUserName(partner);
            const isSelected = activeId === c.id;

            return (
              <ListItemButton
                key={c.id}
                selected={isSelected}
                onClick={() => onSelect(c)}
                sx={{
                  px: { xs: 1.5, md: 2 },
                  py: { xs: 1.5, md: 1.75 },
                  mb: { xs: 1.5, md: 2 },
                  borderRadius: 2,
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid",
                  borderColor: isSelected ? "primary.light" : "transparent",
                  bgcolor: isSelected ? "grey.50" : "transparent",
                  "&.Mui-selected": {
                    bgcolor: "#fff",
                    borderColor: "primary.light",
                    boxShadow: "0 8px 24px -10px rgba(249,115,22,0.2)",
                    "&:hover": { bgcolor: "#fff" },
                  },
                  "&:hover": {
                    bgcolor: "grey.50",
                    borderColor: "grey.100",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 1.5, md: 2 },
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color={partner?.online ? "success" : "default"}
                    sx={{
                      "& .MuiBadge-badge": {
                        border: "2px solid #fff",
                        width: { xs: 12, md: 14 },
                        height: { xs: 12, md: 14 },
                        borderRadius: "50%",
                        boxShadow: partner?.online
                          ? "0 0 10px rgba(34,197,94,0.4)"
                          : "none",
                      },
                    }}
                  >
                    <Avatar
                      src={partner?.avatar}
                      sx={{
                        width: 52,
                        height: 52,
                        bgcolor: "primary.light",
                        color: "primary.main",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        transition: "all 0.3s",
                      }}
                    >
                      {displayName[0]?.toUpperCase()}
                    </Avatar>
                  </Badge>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.75,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "grey.900",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "0.95rem",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {displayName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "grey.400",
                          ml: 1,
                          flexShrink: 0,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {formatTime(c.lastMessageAt || c.createdAt)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: isSelected ? "grey.700" : "grey.500",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "140px",
                          lineHeight: 1.5,
                          fontSize: "0.8rem",
                          fontWeight: isSelected ? 600 : 500,
                        }}
                      >
                        {c.lastMessage?.content || "Started conversation"}
                      </Typography>
                      {c.unreadCount > 0 && (
                        <Box
                          sx={{
                            minWidth: 22,
                            height: 22,
                            borderRadius: "11px",
                            background:
                              "linear-gradient(135deg, #f97316, #ea580c)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            boxShadow: "0 4px 10px rgba(249,115,22,0.3)",
                            ml: 1,
                          }}
                        >
                          {c.unreadCount}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </ListItemButton>
            );
          })
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 6,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "20px",
                bgcolor: "grey.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                color: "grey.300",
              }}
            >
              <MessageSquare size={32} />
            </Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: "grey.400" }}
            >
              No conversations found
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "grey.400", mt: 0.5, fontWeight: 500 }}
            >
              Try searching for a different customer name
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default ChatList;
