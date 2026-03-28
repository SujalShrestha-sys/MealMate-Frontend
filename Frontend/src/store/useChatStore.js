import { create } from "zustand";
import { io } from "socket.io-client";
import chatService from "../api/services/chat.service";
import userService from "../api/services/user.service";
import toast from "react-hot-toast";
import useNotificationStore from "./useNotificationStore";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
  "http://localhost:5000";

const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  socket: null,
  isConnected: false,

  // Initialize socket connection
  initSocket: (userId) => {
    if (get().socket) return;

    const socket = io(SOCKET_URL, {
      auth: {
        token:
          localStorage.getItem("accessToken") || localStorage.getItem("token"),
      },
    });

    socket.on("connect", () => {
      console.log("Connected to chat socket");
      set({ isConnected: true });
      // Join its own room for notifications
      socket.emit("user_online", userId);
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    socket.on("receive_message", (message) => {
      const { activeConversation, messages } = get();
      if (
        activeConversation &&
        message.conversationId === activeConversation.id
      ) {
        // Avoid duplicates — only add if we don't already have this message
        if (!messages.some((m) => m.id === message.id)) {
          set({ messages: [...messages, message] });
        }
      }
      // Also update last message in conversations list
      get().fetchConversations();
    });

    socket.on("new_message_notification", (notification) => {
      console.log("New message notification:", notification);
      // Trigger notification in the notification store
      useNotificationStore.getState().addNotification({
        id: notification.id || Date.now(),
        senderName: notification.senderName || "Admin",
        content: notification.content || "New message received",
        createdAt: notification.createdAt,
      });
      get().fetchConversations();
    });

    socket.on("new_notification", (notification) => {
      console.log("Real-time notification received:", notification);
      // The backend emits notifications with { userId, title, message, ... }
      useNotificationStore.getState().addNotification({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        createdAt: notification.createdAt,
        isRead: notification.isRead,
      });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  fetchConversations: async () => {
    try {
      const response = await chatService.getConversations();
      if (response.success) {
        set({ conversations: response.data });
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  },

  setActiveConversation: async (conversation) => {
    const { socket, activeConversation } = get();

    // Leave previous room if any
    if (activeConversation && socket) {
      socket.emit("leave", activeConversation.id);
    }

    set({ activeConversation: conversation, messages: [] });

    if (conversation) {
      // Join new room
      if (socket) {
        socket.emit("join_conversation", conversation.id);
      }

      // Fetch messages
      try {
        const response = await chatService.getMessages(conversation.id);
        if (response.success) {
          set({ messages: response.data });
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }
  },

  sendMessage: async (content) => {
    const { activeConversation } = get();
    if (!activeConversation || !content.trim()) return;

    try {
      const response = await chatService.sendMessage(
        activeConversation.id,
        content,
      );
      if (response.success && response.data) {
        // Optimistically add the message to local state immediately
        const alreadyExists = get().messages.some(
          (m) => m.id === response.data.id,
        );
        if (!alreadyExists) {
          set({ messages: [...get().messages, response.data] });
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  },

  // Helper to start or get a conversation with a specific user (e.g. Admin)
  startConversation: async (receiverId) => {
    try {
      const response = await chatService.createConversation(receiverId);
      if (response.success) {
        await get().fetchConversations();
        get().setActiveConversation(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  },

  connectToSupport: async () => {
    try {
      const response = await userService.getAdminUser();
      if (response.success && response.data) {
        return await get().startConversation(response.data.id);
      } else {
        toast.error("No support agents available right now.");
      }
    } catch (error) {
      console.error("Failed to connect to support:", error);
      toast.error("Could not connect to support. Please try again.");
    }
  },
}));

export default useChatStore;
