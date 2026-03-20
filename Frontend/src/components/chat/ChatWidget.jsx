import React, { useState, useEffect } from "react";
import ChatFab from "./ChatFab";
import ChatPanel from "./ChatPanel";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import { AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

const ChatWidget = () => {
  const { user, isLoggedIn } = useAuthStore();
  const {
    messages,
    initSocket,
    disconnectSocket,
    setActiveConversation,
    connectToSupport,
    sendMessage,
    fetchConversations,
    conversations,
    activeConversation,
  } = useChatStore();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  // Initialize chat when logged in and widget is open
  useEffect(() => {
    if (isLoggedIn && user) {
      initSocket(user.id);
      fetchConversations();
    }
    return () => {
      disconnectSocket();
    };
  }, [isLoggedIn, user, initSocket, fetchConversations, disconnectSocket]);

  // Handle support conversation (assuming we find an admin or have a default support ID)
  // For now, if no conversation exists, we might need a way to find the support user.
  // Let's pick the first conversation if none is active, or wait for user to select.
  useEffect(() => {
    if (isOpen && conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [isOpen, conversations, activeConversation, setActiveConversation]);

  // Toggle the chat panel open/closed
  const handleToggle = () => {
    if (!isLoggedIn) {
      toast.error("Please login to chat with support");
      return;
    }
    setIsOpen(!isOpen);
  };

  // Close the chat panel
  const handleClose = () => {
    setIsOpen(false);
  };

  // Send a real message
  const handleSend = async () => {
    if (!input.trim()) return;

    // If no active conversation, we need to create one first
    // In this case, we'll try to find an admin ID (mocked for now or fetched)
    if (!activeConversation) {
      // This is a placeholder for finding the Admin/Support ID
      // In a real app, you'd fetch the support user ID
      toast.error("Connecting to support...");
      // startConversation(adminId);
      return;
    }

    await sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel - only shows when open */}
      <AnimatePresence>
        {isOpen && (
          <ChatPanel
            messages={activeConversation ? messages : []}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onClose={handleClose}
            isWelcome={!activeConversation}
            onStartChat={() => {
              connectToSupport();
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating action button - always visible */}
      <ChatFab isOpen={isOpen} onClick={handleToggle} />
    </div>
  );
};

export default ChatWidget;
