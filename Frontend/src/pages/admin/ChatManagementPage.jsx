import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Switch,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import AdminLayout from "../../components/admin/AdminLayout";
import ChatList from "../../components/admin/chat/ChatList";
import ChatWindow from "../../components/admin/chat/ChatWindow";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";

const ChatManagementPage = () => {
  const { user } = useAuthStore();
  const {
    conversations,
    activeConversation,
    messages,
    initSocket,
    fetchConversations,
    setActiveConversation,
    sendMessage,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (user?.id) {
      initSocket(user.id);
      fetchConversations();
    }
  }, [user?.id, initSocket, fetchConversations]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <AdminLayout activePath="/admin/chat">
      <Box
        sx={{
          height: { xs: "calc(100vh - 140px)", md: "calc(100vh - 160px)" }, // Total viewport minus estimated topbar and layout padding
          display: "flex",
          flexDirection: "column",
          mt: { xs: -1.5, md: 0 }, // Pull up slightly on mobile to use top gap
        }}
      >
        {/* Page Header - Ultra Compact on Mobile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: { xs: 2, md: 4 },
            flexDirection: { xs: "row", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 0.5,
                color: "grey.900",
                fontSize: { xs: "1.1rem", md: "1.5rem" },
              }}
            >
              Live Chat
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "grey.500",
                fontWeight: 600,
                display: { xs: "none", sm: "block" },
              }}
            >
              Welcome back! Manage and respond to real-time inquiries.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 0.75, sm: 1 },
              borderRadius: 1,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "grey.100",
              boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: { xs: 8, md: 10 },
                  height: { xs: 8, md: 10 },
                  borderRadius: "50%",
                  bgcolor: isOnline ? "success.main" : "error.main",
                  boxShadow: isOnline
                    ? "0 0 10px rgba(34,197,94,0.5)"
                    : "0 0 10px rgba(239,68,68,0.5)",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "0.65rem", md: "0.75rem" },
                  letterSpacing: "0.05em",
                  color: isOnline ? "success.main" : "error.main",
                }}
              >
                {isOnline ? "ONLINE" : "OFFLINE"}
              </Typography>
            </Box>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                height: 16,
                my: "auto",
                bgcolor: "grey.200",
                display: { xs: "none", sm: "block" },
              }}
            />

            <Switch
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
              color="success"
              size="small"
              sx={{
                display: { xs: "none", sm: "inline-flex" },
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#22c55e",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#22c55e",
                  opacity: 0.2,
                },
              }}
            />
          </Paper>
        </Box>

        {/* Chat Interface Container */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            borderRadius: { xs: 3, md: 1 },
            border: "1px solid",
            borderColor: "grey.100",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
            bgcolor: "#fff",
            mx: { xs: -1.5, sm: 0 }, // Counter AdminLayout's padding on mobile
            mb: { xs: -3, sm: 0 }, // Take all bottom space
          }}
        >
          {/* Chat List (Sidebar) */}
          <ChatList
            conversations={conversations}
            activeId={activeConversation?.id}
            activeTab={activeTab}
            onTabChange={(e, newValue) => setActiveTab(newValue)}
            onSelect={setActiveConversation}
          />

          {/* Chat Window (Main Area) */}
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            inputValue={input}
            onInputChange={setInput}
            onSend={handleSend}
            onBack={() => setActiveConversation(null)}
          />
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default ChatManagementPage;
