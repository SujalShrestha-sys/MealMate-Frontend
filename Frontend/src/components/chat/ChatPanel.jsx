import React from "react";
import { motion } from "motion/react";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const ChatPanel = ({ messages, input, onInputChange, onSend, onClose }) => {
  const variants = {
    initial: { opacity: 0, y: 16, scale: 0.97 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: 16,
      scale: 0.97,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-[370px] h-[510px] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
    >
      <ChatHeader onClose={onClose} />
      <ChatMessages messages={messages} />
      <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
    </motion.div>
  );
};

export default ChatPanel;
