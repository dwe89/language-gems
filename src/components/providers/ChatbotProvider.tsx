'use client';

import { createContext, useContext, useState } from 'react';

interface ChatbotContextType {
  isOpen: boolean;
  toggleChatbot: () => void;
  openChatbot: () => void;
  closeChatbot: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => setIsOpen(!isOpen);
  const openChatbot = () => setIsOpen(true);
  const closeChatbot = () => setIsOpen(false);

  return (
    <ChatbotContext.Provider value={{
      isOpen,
      toggleChatbot,
      openChatbot,
      closeChatbot
    }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}