import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Paper,
  Divider,
  Badge,
} from "@mui/material";
import { Send, MoreVertical, MessageSquare, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import useAuthStore from "../../../store/useAuthStore";

/**
 * ChatWindow Component
 * Renders the conversation window for the active chat.
 */
const ChatWindow = ({
  conversation,
  messages = [],
  onSend,
  inputValue,
  onInputChange,
  onBack,
}) => {
  const scrollRef = useRef(null);
  const { user: currentUser } = useAuthStore();

  // Helper to resolve the chat partner from the participants array
  const getChatPartner = () => {
    if (!conversation || !conversation.participants || !currentUser)
      return null;
    return conversation.participants.find((p) => p.id !== currentUser.id);
  };

  const partner = getChatPartner();

  // Helper to resolve the display name of the chat partner
  const getPartnerName = () => {
    if (!partner) return "Customer";
    return partner.name || partner.fullName || partner.username || "Customer";
  };

  const partnerName = getPartnerName();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8fafc",
          opacity: 0.6,
        }}
      >
        <MessageSquare size={48} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
          Select a conversation
        </Typography>
        <Typography variant="body2">
          Click on a chat to start messaging
        </Typography>
      </Box>
    );
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: { xs: conversation ? "flex" : "none", md: "flex" },
        flexDirection: "column",
        height: "100%",
        bgcolor: "#fff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2.5, md: 4 },
          py: { xs: 1.5, md: 2 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#fff",
          borderBottom: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2.5 } }}>
          {/* Mobile Back Button */}
          <IconButton
            onClick={onBack}
            sx={{
              display: { xs: "flex", md: "none" },
              ml: -1.5,
              mr: -0.5,
              color: "grey.700",
            }}
          >
            <ArrowLeft size={22} />
          </IconButton>

          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            color={partner?.online ? "success" : "default"}
            sx={{
              "& .MuiBadge-badge": {
                width: { xs: 10, md: 12 },
                height: { xs: 10, md: 12 },
                border: "2px solid #fff",
                boxShadow: partner?.online
                  ? "0 0 10px rgba(34,197,94,0.4)"
                  : "none",
              },
            }}
          >
            <Avatar
              src={partner?.avatar}
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                bgcolor: "primary.light",
                color: "primary.main",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {partnerName[0]?.toUpperCase()}
            </Avatar>
          </Badge>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "grey.900",
                lineHeight: 1.2,
                mb: 0.25,
                fontSize: { xs: "0.95rem", md: "1.05rem" },
              }}
            >
              {partnerName}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: partner?.online ? "success.main" : "grey.300",
                  boxShadow: partner?.online
                    ? "0 0 6px rgba(34,197,94,0.4)"
                    : "none",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: partner?.online ? "success.main" : "grey.500",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  fontSize: "0.7rem",
                }}
              >
                {partner?.online ? "ACTIVE" : "OFFLINE"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <IconButton
          sx={{
            color: "grey.400",
            "&:hover": { bgcolor: "grey.50", color: "grey.900" },
          }}
        >
          <MoreVertical size={20} />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: { xs: 2.5, md: 5 },
          bgcolor: "#ffffff",
          backgroundImage:
            "radial-gradient(rgba(241, 245, 249, 0.5) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            // ROBUST SEPARATION LOGIC
            const isMe =
              msg.senderId === currentUser?.id ||
              msg.senderRole === "ADMIN" ||
              msg.isAdmin === true ||
              msg.sender?.role?.name === "ADMIN" ||
              msg.sender?.role === "ADMIN";

            return (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  marginBottom: "20px",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "85%",
                    p: { xs: 1.75, md: 2.5 },
                    px: { xs: 2, md: 3 },
                    borderRadius: isMe
                      ? "20px 20px 4px 20px"
                      : "20px 20px 20px 4px",
                    background: isMe
                      ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                      : "#ffffff",
                    color: isMe ? "#fff" : "grey.800",
                    boxShadow: isMe
                      ? "0 8px 20px -5px rgba(249,115,22,0.25)"
                      : "0 4px 12px rgba(0,0,0,0.04)",
                    border: isMe ? "none" : "1px solid",
                    borderColor: "grey.100",
                    position: "relative",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.5,
                      fontWeight: 500,
                      fontSize: { xs: "0.875rem", md: "0.95rem" },
                    }}
                  >
                    {msg.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1.25,
                      textAlign: isMe ? "right" : "left",
                      opacity: 0.8,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: isMe ? "rgba(255,255,255,0.9)" : "grey.400",
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          pt: 1,
          bgcolor: "#fff",
          borderTop: "1px solid",
          borderColor: "grey.50",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, md: 2 },
            p: { xs: 1, md: 1.25 },
            px: { xs: 2, md: 2.5 },
            borderRadius: { xs: 3, md: 4 },
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "grey.100",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:focus-within": {
              bgcolor: "#fff",
              borderColor: "primary.light",
              boxShadow: "0 12px 32px -12px rgba(249,115,22,0.2)",
              transform: "translateY(-4px)",
            },
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{
              py: 0.5,
              "& textarea": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                color: "grey.900",
                fontWeight: 500,
                lineHeight: 1.5,
              },
            }}
          />
          <IconButton
            onClick={onSend}
            disabled={!inputValue.trim()}
            sx={{
              width: { xs: 40, md: 48 },
              height: { xs: 40, md: 48 },
              borderRadius: 2,
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "#fff",
              boxShadow: "0 6px 16px rgba(249,115,22,0.3)",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #ea580c, #c2410c)",
                transform: "scale(1.08) rotate(-5deg)",
                boxShadow: "0 8px 20px rgba(249,115,22,0.4)",
              },
              "&.Mui-disabled": {
                bgcolor: "grey.200",
                color: "grey.400",
                boxShadow: "none",
              },
            }}
          >
            <Send size={18} strokeWidth={2.5} />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatWindow;
